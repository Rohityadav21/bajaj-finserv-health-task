import csv
import io
from django.db import transaction
from django.db.models import Count, Avg, F, Q
from django.utils import timezone
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Issue, Comment, Label, IssueLabel, User, IssueHistory
from .serializers import (
    IssueSerializer, IssueListSerializer, CommentSerializer,
    LabelSerializer, BulkStatusUpdateSerializer, IssueImportSerializer,
    IssueLabelSerializer, UserSerializer, IssueHistorySerializer
)


class IssueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Issue CRUD operations with filtering and pagination.
    
    Endpoints:
    - GET /api/issues/ - List issues with filters
    - POST /api/issues/ - Create new issue
    - GET /api/issues/{id}/ - Get issue detail
    - PATCH /api/issues/{id}/ - Update issue (with version check)
    - DELETE /api/issues/{id}/ - Delete issue
    """
    queryset = Issue.objects.all().select_related('assignee').prefetch_related('comments', 'issue_labels__label')
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['status', 'assignee', 'assignee__email']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view."""
        if self.action == 'list':
            return IssueListSerializer
        return IssueSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new issue."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """
        Update issue with optimistic locking.
        Requires 'version' field in request data.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def comments(self, request, pk=None):
        """
        Add a comment to an issue.
        POST /api/issues/{id}/comments/
        """
        issue = self.get_object()
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set author from request if available, otherwise use issue assignee or first user
        author_id = request.data.get('author_id')
        if not author_id:
            # For testing purposes, use first user if no author specified
            author = User.objects.first()
            if not author:
                return Response(
                    {'error': 'No users exist. Please create a user first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            try:
                author = User.objects.get(id=author_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Author not found.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer.save(issue=issue, author=author)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['put'])
    def labels(self, request, pk=None):
        """
        Replace all labels for an issue atomically.
        PUT /api/issues/{id}/labels/
        Body: {"labels": ["bug", "urgent", "backend"]}
        """
        issue = self.get_object()
        serializer = IssueLabelSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        label_names = serializer.validated_data['labels']
        serializer.update_labels(issue, label_names)
        
        # Return updated issue with labels
        issue_serializer = IssueSerializer(issue)
        return Response(issue_serializer.data)
    
    @action(detail=True, methods=['get'])
    def timeline(self, request, pk=None):
        """
        Get issue timeline/history.
        GET /api/issues/{id}/timeline/
        """
        issue = self.get_object()
        history = IssueHistory.objects.filter(issue=issue).select_related('changed_by')
        serializer = IssueHistorySerializer(history, many=True)
        return Response(serializer.data)


class BulkStatusUpdateView(APIView):
    """
    Bulk update issue statuses with transaction support.
    POST /api/issues/bulk-status/
    Body: {"issue_ids": [1, 2, 3], "status": "resolved"}
    """
    
    @transaction.atomic
    def post(self, request):
        serializer = BulkStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        issue_ids = serializer.validated_data['issue_ids']
        new_status = serializer.validated_data['status']
        
        # Update all issues
        updated_count = Issue.objects.filter(id__in=issue_ids).update(
            status=new_status,
            version=F('version') + 1
        )
        
        # Log history for each issue
        issues = Issue.objects.filter(id__in=issue_ids)
        changed_by = request.user if hasattr(request, 'user') and request.user.is_authenticated else None
        
        history_entries = [
            IssueHistory(
                issue=issue,
                change_type='status_changed',
                field_name='status',
                new_value=new_status,
                changed_by=changed_by
            )
            for issue in issues
        ]
        IssueHistory.objects.bulk_create(history_entries)
        
        return Response({
            'message': f'Successfully updated {updated_count} issues',
            'updated_ids': issue_ids,
            'new_status': new_status
        }, status=status.HTTP_200_OK)


class IssueImportView(APIView):
    """
    Import issues from CSV file.
    POST /api/issues/import/
    
    CSV format:
    title,description,status,assignee_email
    "Bug in login","Users cannot login","open","user@example.com"
    """
    
    def post(self, request):
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided. Please upload a CSV file.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        csv_file = request.FILES['file']
        
        # Validate file type
        if not csv_file.name.endswith('.csv'):
            return Response(
                {'error': 'File must be a CSV file.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Read and parse CSV
        try:
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
        except Exception as e:
            return Response(
                {'error': f'Error reading CSV file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process rows
        results = {
            'total_rows': 0,
            'successful': 0,
            'failed': 0,
            'errors': []
        }
        
        for idx, row in enumerate(reader, start=1):
            results['total_rows'] += 1
            
            try:
                # Validate and create issue
                serializer = IssueImportSerializer(data=row)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                results['successful'] += 1
            except Exception as e:
                results['failed'] += 1
                error_message = str(e)
                if hasattr(e, 'detail'):
                    error_message = str(e.detail)
                results['errors'].append({
                    'row': idx,
                    'data': row,
                    'error': error_message
                })
        
        return Response(results, status=status.HTTP_200_OK)


class TopAssigneesView(APIView):
    """
    Get top assignees by issue count.
    GET /api/reports/top-assignees/?limit=10
    """
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        
        top_assignees = User.objects.annotate(
            issue_count=Count('assigned_issues')
        ).filter(
            issue_count__gt=0
        ).order_by('-issue_count')[:limit]
        
        results = [
            {
                'user': UserSerializer(user).data,
                'issue_count': user.issue_count
            }
            for user in top_assignees
        ]
        
        return Response({
            'top_assignees': results,
            'limit': limit
        })


class ResolutionLatencyView(APIView):
    """
    Get average resolution time for issues.
    GET /api/reports/latency/?status=resolved
    """
    
    def get(self, request):
        status_filter = request.query_params.get('status', 'resolved')
        
        # Filter issues with resolved_at set
        issues = Issue.objects.filter(
            status=status_filter,
            resolved_at__isnull=False
        )
        
        # Calculate average resolution time
        avg_time = issues.aggregate(
            avg_resolution_time=Avg(F('resolved_at') - F('created_at'))
        )['avg_resolution_time']
        
        if avg_time is None:
            return Response({
                'message': 'No resolved issues found',
                'average_resolution_time': None
            })
        
        # Convert to days and hours
        total_seconds = avg_time.total_seconds()
        days = int(total_seconds // 86400)
        hours = int((total_seconds % 86400) // 3600)
        minutes = int((total_seconds % 3600) // 60)
        
        return Response({
            'status_filter': status_filter,
            'total_issues': issues.count(),
            'average_resolution_time': {
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'total_seconds': total_seconds
            }
        })


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User management.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['email', 'name', 'username']

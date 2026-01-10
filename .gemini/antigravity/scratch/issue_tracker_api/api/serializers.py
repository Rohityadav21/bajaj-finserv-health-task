from rest_framework import serializers
from django.db import transaction
from .models import User, Issue, Comment, Label, IssueLabel, IssueHistory


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username']
        read_only_fields = ['id']


class LabelSerializer(serializers.ModelSerializer):
    """Serializer for Label model."""
    
    class Meta:
        model = Label
        fields = ['id', 'name']
        read_only_fields = ['id']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model with validation."""
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'issue', 'author', 'author_id', 'body', 'created_at']
        read_only_fields = ['id', 'created_at', 'author', 'issue']
    
    def validate_body(self, value):
        """Ensure comment body is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment body cannot be empty.")
        return value
    
    def create(self, validated_data):
        """Create comment and log in history."""
        comment = super().create(validated_data)
        
        # Create history entry
        IssueHistory.objects.create(
            issue=comment.issue,
            change_type='comment_added',
            field_name='comment',
            new_value=f"Comment by {comment.author.email}",
            changed_by=comment.author
        )
        
        return comment


class IssueSerializer(serializers.ModelSerializer):
    """
    Serializer for Issue model with optimistic locking support.
    """
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    comments = CommentSerializer(many=True, read_only=True)
    labels = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'status', 'assignee', 'assignee_id',
            'created_at', 'updated_at', 'resolved_at', 'version',
            'comments', 'labels'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at']
    
    def get_labels(self, obj):
        """Get all labels associated with this issue."""
        labels = Label.objects.filter(issue_labels__issue=obj)
        return LabelSerializer(labels, many=True).data
    
    def validate_status(self, value):
        """Validate status is one of the allowed choices."""
        valid_statuses = ['open', 'in_progress', 'resolved', 'closed']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
    
    def validate_assignee_id(self, value):
        """Validate assignee exists."""
        if value is not None:
            try:
                User.objects.get(id=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("Assignee not found.")
        return value
    
    def create(self, validated_data):
        """Create issue and log in history."""
        assignee_id = validated_data.pop('assignee_id', None)
        if assignee_id:
            validated_data['assignee_id'] = assignee_id
        
        issue = super().create(validated_data)
        
        # Create history entry
        IssueHistory.objects.create(
            issue=issue,
            change_type='created',
            new_value=f"Issue created: {issue.title}",
            changed_by=validated_data.get('assignee')
        )
        
        return issue
    
    def update(self, instance, validated_data):
        """
        Update issue with optimistic locking.
        Raises ValidationError if version mismatch.
        """
        provided_version = validated_data.get('version', instance.version)
        
        # Check version for optimistic locking
        if provided_version != instance.version:
            raise serializers.ValidationError({
                'version': 'Conflict: Issue was modified by another user. Please refresh and try again.'
            })
        
        # Track changes for history
        old_status = instance.status
        old_assignee = instance.assignee
        
        # Handle assignee_id
        assignee_id = validated_data.pop('assignee_id', None)
        if assignee_id is not None:
            validated_data['assignee_id'] = assignee_id
        
        # Increment version
        validated_data['version'] = instance.version + 1
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Log changes in history
        request = self.context.get('request')
        changed_by = request.user if request and hasattr(request, 'user') else None
        
        if old_status != instance.status:
            IssueHistory.objects.create(
                issue=instance,
                change_type='status_changed',
                field_name='status',
                old_value=old_status,
                new_value=instance.status,
                changed_by=changed_by
            )
        
        if old_assignee != instance.assignee:
            IssueHistory.objects.create(
                issue=instance,
                change_type='assignee_changed',
                field_name='assignee',
                old_value=old_assignee.email if old_assignee else 'None',
                new_value=instance.assignee.email if instance.assignee else 'None',
                changed_by=changed_by
            )
        
        return instance


class IssueListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for issue list view."""
    assignee = UserSerializer(read_only=True)
    label_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'status', 'assignee', 'created_at', 
            'updated_at', 'version', 'label_count', 'comment_count'
        ]
    
    def get_label_count(self, obj):
        return obj.issue_labels.count()
    
    def get_comment_count(self, obj):
        return obj.comments.count()


class BulkStatusUpdateSerializer(serializers.Serializer):
    """Serializer for bulk status updates."""
    issue_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )
    status = serializers.CharField()
    
    def validate_status(self, value):
        """Validate status is one of the allowed choices."""
        valid_statuses = ['open', 'in_progress', 'resolved', 'closed']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
    
    def validate_issue_ids(self, value):
        """Validate all issue IDs exist."""
        existing_ids = set(Issue.objects.filter(id__in=value).values_list('id', flat=True))
        provided_ids = set(value)
        
        if existing_ids != provided_ids:
            missing_ids = provided_ids - existing_ids
            raise serializers.ValidationError(
                f"Issues not found: {list(missing_ids)}"
            )
        
        return value


class IssueImportSerializer(serializers.Serializer):
    """Serializer for CSV import validation."""
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    status = serializers.CharField(default='open')
    assignee_email = serializers.EmailField(required=False, allow_blank=True)
    
    def validate_status(self, value):
        """Validate status is one of the allowed choices."""
        valid_statuses = ['open', 'in_progress', 'resolved', 'closed']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
    
    def validate_assignee_email(self, value):
        """Validate assignee exists if provided."""
        if value:
            try:
                User.objects.get(email=value)
            except User.DoesNotExist:
                raise serializers.ValidationError(f"User with email {value} not found.")
        return value
    
    def create(self, validated_data):
        """Create issue from CSV data."""
        assignee_email = validated_data.pop('assignee_email', None)
        assignee = None
        
        if assignee_email:
            assignee = User.objects.get(email=assignee_email)
        
        issue = Issue.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            status=validated_data['status'],
            assignee=assignee
        )
        
        return issue


class IssueLabelSerializer(serializers.Serializer):
    """Serializer for managing issue labels."""
    labels = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True
    )
    
    @transaction.atomic
    def update_labels(self, issue, label_names):
        """
        Atomically replace all labels for an issue.
        """
        # Remove all existing labels
        IssueLabel.objects.filter(issue=issue).delete()
        
        # Track changes
        request = self.context.get('request')
        changed_by = None
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            changed_by = request.user
        
        # Add new labels
        for label_name in label_names:
            label, created = Label.objects.get_or_create(name=label_name)
            IssueLabel.objects.create(issue=issue, label=label)
            
            # Log label addition
            IssueHistory.objects.create(
                issue=issue,
                change_type='label_added',
                field_name='label',
                new_value=label_name,
                changed_by=changed_by
            )
        
        return issue


class IssueHistorySerializer(serializers.ModelSerializer):
    """Serializer for issue history/timeline."""
    changed_by = UserSerializer(read_only=True)
    
    class Meta:
        model = IssueHistory
        fields = [
            'id', 'change_type', 'field_name', 'old_value', 
            'new_value', 'changed_by', 'changed_at'
        ]
        read_only_fields = fields

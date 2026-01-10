from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User, Issue, Comment, Label


class IssueAPITest(TestCase):
    """Test Issue API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
    
    def test_create_issue(self):
        """Test creating a new issue."""
        data = {
            'title': 'New Issue',
            'description': 'Issue description',
            'status': 'open',
            'assignee_id': self.user.id
        }
        response = self.client.post('/api/issues/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Issue')
        self.assertEqual(response.data['version'], 0)
    
    def test_list_issues(self):
        """Test listing issues."""
        Issue.objects.create(
            title='Issue 1',
            description='Description 1',
            status='open'
        )
        Issue.objects.create(
            title='Issue 2',
            description='Description 2',
            status='in_progress'
        )
        
        response = self.client.get('/api/issues/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_filter_issues_by_status(self):
        """Test filtering issues by status."""
        Issue.objects.create(
            title='Issue 1',
            description='Description 1',
            status='open'
        )
        Issue.objects.create(
            title='Issue 2',
            description='Description 2',
            status='resolved'
        )
        
        response = self.client.get('/api/issues/?status=open')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['status'], 'open')
    
    def test_get_issue_detail(self):
        """Test getting issue detail with comments and labels."""
        issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
        
        response = self.client.get(f'/api/issues/{issue.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Issue')
        self.assertIn('comments', response.data)
        self.assertIn('labels', response.data)
    
    def test_update_issue_with_version_check(self):
        """Test updating issue with optimistic locking."""
        issue = Issue.objects.create(
            title='Original Title',
            description='Original Description',
            status='open'
        )
        
        # Successful update with correct version
        data = {
            'title': 'Updated Title',
            'version': 0
        }
        response = self.client.patch(f'/api/issues/{issue.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
        self.assertEqual(response.data['version'], 1)
    
    def test_update_issue_version_conflict(self):
        """Test version conflict detection."""
        issue = Issue.objects.create(
            title='Original Title',
            description='Original Description',
            status='open'
        )
        
        # Update to increment version
        issue.version = 1
        issue.save()
        
        # Try to update with old version
        data = {
            'title': 'Updated Title',
            'version': 0
        }
        response = self.client.patch(f'/api/issues/{issue.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn('version', response.data)
    
    def test_delete_issue(self):
        """Test deleting an issue."""
        issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
        
        response = self.client.delete(f'/api/issues/{issue.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Issue.objects.filter(id=issue.id).exists())


class CommentAPITest(TestCase):
    """Test Comment API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
        self.issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
    
    def test_add_comment(self):
        """Test adding a comment to an issue."""
        data = {
            'body': 'This is a test comment',
            'author_id': self.user.id
        }
        response = self.client.post(f'/api/issues/{self.issue.id}/comments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['body'], 'This is a test comment')
        self.assertEqual(response.data['author']['id'], self.user.id)
    
    def test_add_empty_comment(self):
        """Test that empty comments are rejected."""
        data = {
            'body': '',
            'author_id': self.user.id
        }
        response = self.client.post(f'/api/issues/{self.issue.id}/comments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LabelAPITest(TestCase):
    """Test Label API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
    
    def test_replace_labels(self):
        """Test replacing all labels atomically."""
        data = {
            'labels': ['bug', 'urgent', 'backend']
        }
        response = self.client.put(f'/api/issues/{self.issue.id}/labels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['labels']), 3)
    
    def test_clear_labels(self):
        """Test clearing all labels."""
        # Add some labels first
        Label.objects.create(name='bug')
        self.issue.issue_labels.create(label=Label.objects.get(name='bug'))
        
        # Clear labels
        data = {'labels': []}
        response = self.client.put(f'/api/issues/{self.issue.id}/labels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['labels']), 0)


class BulkUpdateAPITest(TestCase):
    """Test bulk status update endpoint."""
    
    def setUp(self):
        self.client = APIClient()
        self.issue1 = Issue.objects.create(
            title='Issue 1',
            description='Description 1',
            status='open'
        )
        self.issue2 = Issue.objects.create(
            title='Issue 2',
            description='Description 2',
            status='open'
        )
        self.issue3 = Issue.objects.create(
            title='Issue 3',
            description='Description 3',
            status='open'
        )
    
    def test_bulk_status_update(self):
        """Test bulk status update."""
        data = {
            'issue_ids': [self.issue1.id, self.issue2.id],
            'status': 'resolved'
        }
        response = self.client.post('/api/issues/bulk-status/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify updates
        self.issue1.refresh_from_db()
        self.issue2.refresh_from_db()
        self.assertEqual(self.issue1.status, 'resolved')
        self.assertEqual(self.issue2.status, 'resolved')
    
    def test_bulk_update_invalid_status(self):
        """Test bulk update with invalid status."""
        data = {
            'issue_ids': [self.issue1.id],
            'status': 'invalid_status'
        }
        response = self.client.post('/api/issues/bulk-status/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_bulk_update_nonexistent_issue(self):
        """Test bulk update with nonexistent issue ID."""
        data = {
            'issue_ids': [self.issue1.id, 99999],
            'status': 'resolved'
        }
        response = self.client.post('/api/issues/bulk-status/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ReportAPITest(TestCase):
    """Test report endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123',
            name='User 1'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123',
            name='User 2'
        )
        
        # Create issues for user1
        for i in range(5):
            Issue.objects.create(
                title=f'Issue {i}',
                description=f'Description {i}',
                status='open',
                assignee=self.user1
            )
        
        # Create issues for user2
        for i in range(3):
            Issue.objects.create(
                title=f'Issue {i+5}',
                description=f'Description {i+5}',
                status='open',
                assignee=self.user2
            )
    
    def test_top_assignees(self):
        """Test top assignees report."""
        response = self.client.get('/api/reports/top-assignees/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('top_assignees', response.data)
        self.assertEqual(len(response.data['top_assignees']), 2)
        self.assertEqual(response.data['top_assignees'][0]['issue_count'], 5)
    
    def test_resolution_latency(self):
        """Test resolution latency report."""
        # Create a resolved issue
        issue = Issue.objects.create(
            title='Resolved Issue',
            description='Description',
            status='resolved'
        )
        
        response = self.client.get('/api/reports/latency/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('average_resolution_time', response.data)


class TimelineAPITest(TestCase):
    """Test timeline endpoint."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
        self.issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
    
    def test_issue_timeline(self):
        """Test getting issue timeline."""
        response = self.client.get(f'/api/issues/{self.issue.id}/timeline/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

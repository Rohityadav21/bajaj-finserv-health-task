import threading
from django.test import TestCase, TransactionTestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User, Issue
from django.db import transaction


class ConcurrencyTest(TransactionTestCase):
    """Test concurrency control with optimistic locking."""
    
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
            status='open',
            version=0
        )
    
    def test_concurrent_update_detection(self):
        """Test that concurrent updates are detected via version check."""
        # Simulate two users getting the same issue
        issue_v0 = Issue.objects.get(id=self.issue.id)
        self.assertEqual(issue_v0.version, 0)
        
        # First user updates successfully
        data1 = {
            'title': 'Updated by User 1',
            'version': 0
        }
        response1 = self.client.patch(f'/api/issues/{self.issue.id}/', data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data['version'], 1)
        
        # Second user tries to update with stale version
        data2 = {
            'title': 'Updated by User 2',
            'version': 0  # Stale version
        }
        response2 = self.client.patch(f'/api/issues/{self.issue.id}/', data2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_409_CONFLICT)
        self.assertIn('version', response2.data)
    
    def test_version_increment_on_update(self):
        """Test that version increments on each update."""
        for i in range(5):
            issue = Issue.objects.get(id=self.issue.id)
            data = {
                'title': f'Update {i}',
                'version': issue.version
            }
            response = self.client.patch(f'/api/issues/{issue.id}/', data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['version'], i + 1)
    
    def test_optimistic_locking_prevents_lost_updates(self):
        """Test that optimistic locking prevents lost updates."""
        # Get initial state
        issue = Issue.objects.get(id=self.issue.id)
        initial_version = issue.version
        
        # Update 1
        data1 = {
            'description': 'First update',
            'version': initial_version
        }
        response1 = self.client.patch(f'/api/issues/{issue.id}/', data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        
        # Update 2 with stale version should fail
        data2 = {
            'description': 'Second update with stale version',
            'version': initial_version
        }
        response2 = self.client.patch(f'/api/issues/{issue.id}/', data2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_409_CONFLICT)
        
        # Verify first update was preserved
        issue.refresh_from_db()
        self.assertEqual(issue.description, 'First update')


class TransactionTest(TransactionTestCase):
    """Test transaction handling."""
    
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
    
    def test_bulk_update_transaction_rollback(self):
        """Test that bulk update rolls back on error."""
        # Try to update with one invalid issue ID
        data = {
            'issue_ids': [self.issue1.id, 99999],  # 99999 doesn't exist
            'status': 'resolved'
        }
        response = self.client.post('/api/issues/bulk-status/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Verify no issues were updated
        self.issue1.refresh_from_db()
        self.assertEqual(self.issue1.status, 'open')
    
    def test_bulk_update_all_or_nothing(self):
        """Test that bulk update is atomic (all or nothing)."""
        # Valid bulk update
        data = {
            'issue_ids': [self.issue1.id, self.issue2.id],
            'status': 'resolved'
        }
        response = self.client.post('/api/issues/bulk-status/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify all issues were updated
        self.issue1.refresh_from_db()
        self.issue2.refresh_from_db()
        self.assertEqual(self.issue1.status, 'resolved')
        self.assertEqual(self.issue2.status, 'resolved')
    
    def test_label_replacement_atomic(self):
        """Test that label replacement is atomic."""
        # Replace labels
        data = {'labels': ['bug', 'urgent', 'backend']}
        response = self.client.put(f'/api/issues/{self.issue1.id}/labels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['labels']), 3)
        
        # Replace again - old labels should be removed
        data = {'labels': ['feature']}
        response = self.client.put(f'/api/issues/{self.issue1.id}/labels/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['labels']), 1)
        self.assertEqual(response.data['labels'][0]['name'], 'feature')

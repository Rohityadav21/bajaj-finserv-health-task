import io
import csv
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User, Issue


class CSVImportTest(TestCase):
    """Test CSV import functionality."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
    
    def create_csv_file(self, rows):
        """Helper to create CSV file."""
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['title', 'description', 'status', 'assignee_email'])
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
        output.seek(0)
        return output
    
    def test_valid_csv_import(self):
        """Test importing valid CSV file."""
        rows = [
            {
                'title': 'Issue 1',
                'description': 'Description 1',
                'status': 'open',
                'assignee_email': 'test@example.com'
            },
            {
                'title': 'Issue 2',
                'description': 'Description 2',
                'status': 'in_progress',
                'assignee_email': ''
            }
        ]
        
        csv_file = self.create_csv_file(rows)
        csv_file.name = 'test.csv'
        
        response = self.client.post('/api/issues/import/', {'file': csv_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_rows'], 2)
        self.assertEqual(response.data['successful'], 2)
        self.assertEqual(response.data['failed'], 0)
    
    def test_csv_import_with_invalid_status(self):
        """Test CSV import with invalid status."""
        rows = [
            {
                'title': 'Issue 1',
                'description': 'Description 1',
                'status': 'invalid_status',
                'assignee_email': ''
            }
        ]
        
        csv_file = self.create_csv_file(rows)
        csv_file.name = 'test.csv'
        
        response = self.client.post('/api/issues/import/', {'file': csv_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_rows'], 1)
        self.assertEqual(response.data['successful'], 0)
        self.assertEqual(response.data['failed'], 1)
        self.assertEqual(len(response.data['errors']), 1)
    
    def test_csv_import_with_nonexistent_assignee(self):
        """Test CSV import with nonexistent assignee."""
        rows = [
            {
                'title': 'Issue 1',
                'description': 'Description 1',
                'status': 'open',
                'assignee_email': 'nonexistent@example.com'
            }
        ]
        
        csv_file = self.create_csv_file(rows)
        csv_file.name = 'test.csv'
        
        response = self.client.post('/api/issues/import/', {'file': csv_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['failed'], 1)
    
    def test_csv_import_no_file(self):
        """Test CSV import without file."""
        response = self.client.post('/api/issues/import/', {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_csv_import_wrong_file_type(self):
        """Test CSV import with wrong file type."""
        file_content = io.StringIO("not a csv")
        file_content.name = 'test.txt'
        
        response = self.client.post('/api/issues/import/', {'file': file_content}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_csv_import_summary_report(self):
        """Test CSV import returns proper summary report."""
        rows = [
            {
                'title': 'Valid Issue',
                'description': 'Description',
                'status': 'open',
                'assignee_email': ''
            },
            {
                'title': 'Invalid Issue',
                'description': 'Description',
                'status': 'invalid',
                'assignee_email': ''
            }
        ]
        
        csv_file = self.create_csv_file(rows)
        csv_file.name = 'test.csv'
        
        response = self.client.post('/api/issues/import/', {'file': csv_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check summary structure
        self.assertIn('total_rows', response.data)
        self.assertIn('successful', response.data)
        self.assertIn('failed', response.data)
        self.assertIn('errors', response.data)
        
        # Verify counts
        self.assertEqual(response.data['total_rows'], 2)
        self.assertEqual(response.data['successful'], 1)
        self.assertEqual(response.data['failed'], 1)
        
        # Verify error details
        self.assertEqual(len(response.data['errors']), 1)
        self.assertIn('row', response.data['errors'][0])
        self.assertIn('error', response.data['errors'][0])

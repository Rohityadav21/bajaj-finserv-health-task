#!/usr/bin/env python
"""
API Test Script for Issue Tracker API
Run with: python test_api.py

Make sure the server is running: python manage.py runserver
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def print_response(title, response):
    """Pretty print API response."""
    print(f"\n{'='*60}")
    print(f"📍 {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_api():
    """Test all API endpoints."""
    
    print("\n🚀 Starting API Tests...\n")
    
    # 1. List all issues
    response = requests.get(f"{BASE_URL}/issues/")
    print_response("GET /api/issues/ - List all issues", response)
    
    # Get first issue ID for subsequent tests
    issues = response.json()['results']
    if issues:
        issue_id = issues[0]['id']
        issue_version = issues[0]['version']
    else:
        print("\n⚠️  No issues found. Please run create_sample_data.py first.")
        return
    
    # 2. Filter issues by status
    response = requests.get(f"{BASE_URL}/issues/?status=open")
    print_response("GET /api/issues/?status=open - Filter by status", response)
    
    # 3. Get issue detail
    response = requests.get(f"{BASE_URL}/issues/{issue_id}/")
    print_response(f"GET /api/issues/{issue_id}/ - Get issue detail", response)
    
    # 4. Create new issue
    new_issue = {
        "title": "Test Issue from API",
        "description": "This is a test issue created via API",
        "status": "open"
    }
    response = requests.post(f"{BASE_URL}/issues/", json=new_issue)
    print_response("POST /api/issues/ - Create new issue", response)
    
    if response.status_code == 201:
        new_issue_id = response.json()['id']
        new_issue_version = response.json()['version']
        
        # 5. Update issue with correct version
        update_data = {
            "title": "Updated Test Issue",
            "status": "in_progress",
            "version": new_issue_version
        }
        response = requests.patch(f"{BASE_URL}/issues/{new_issue_id}/", json=update_data)
        print_response(f"PATCH /api/issues/{new_issue_id}/ - Update issue (correct version)", response)
        
        # 6. Try to update with stale version (should fail)
        update_data = {
            "title": "This should fail",
            "version": new_issue_version  # Stale version
        }
        response = requests.patch(f"{BASE_URL}/issues/{new_issue_id}/", json=update_data)
        print_response(f"PATCH /api/issues/{new_issue_id}/ - Update with stale version (should fail)", response)
        
        # 7. Add comment
        comment_data = {
            "body": "This is a test comment",
            "author_id": 1
        }
        response = requests.post(f"{BASE_URL}/issues/{new_issue_id}/comments/", json=comment_data)
        print_response(f"POST /api/issues/{new_issue_id}/comments/ - Add comment", response)
        
        # 8. Add labels
        labels_data = {
            "labels": ["bug", "urgent", "backend"]
        }
        response = requests.put(f"{BASE_URL}/issues/{new_issue_id}/labels/", json=labels_data)
        print_response(f"PUT /api/issues/{new_issue_id}/labels/ - Add labels", response)
        
        # 9. Get timeline
        response = requests.get(f"{BASE_URL}/issues/{new_issue_id}/timeline/")
        print_response(f"GET /api/issues/{new_issue_id}/timeline/ - Get issue timeline", response)
    
    # 10. Bulk status update
    bulk_data = {
        "issue_ids": [1, 2],
        "status": "resolved"
    }
    response = requests.post(f"{BASE_URL}/issues/bulk-status/", json=bulk_data)
    print_response("POST /api/issues/bulk-status/ - Bulk status update", response)
    
    # 11. Top assignees report
    response = requests.get(f"{BASE_URL}/reports/top-assignees/?limit=5")
    print_response("GET /api/reports/top-assignees/ - Top assignees report", response)
    
    # 12. Resolution latency report
    response = requests.get(f"{BASE_URL}/reports/latency/")
    print_response("GET /api/reports/latency/ - Resolution latency report", response)
    
    # 13. CSV Import (if file exists)
    try:
        with open('sample_issues.csv', 'rb') as f:
            files = {'file': ('sample_issues.csv', f, 'text/csv')}
            response = requests.post(f"{BASE_URL}/issues/import/", files=files)
            print_response("POST /api/issues/import/ - CSV import", response)
    except FileNotFoundError:
        print("\n⚠️  sample_issues.csv not found. Skipping CSV import test.")
    
    print("\n\n✅ API Tests Completed!")
    print("\n" + "="*60)
    print("Summary:")
    print("  - All endpoints tested")
    print("  - Check responses above for details")
    print("  - Visit http://localhost:8000/admin/ for admin interface")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API server.")
        print("Please make sure the server is running:")
        print("  python manage.py runserver")
    except Exception as e:
        print(f"\n❌ Error: {e}")

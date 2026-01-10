# Postman Testing Guide - Issue Tracker API

This guide will help you test all API endpoints using Postman.

## 🚀 Setup

1. **Start the server:**
   ```bash
   cd /Users/rohit/.gemini/antigravity/scratch/issue_tracker_api
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Base URL:** `http://localhost:8000/api`

3. **Create sample data (if not already done):**
   ```bash
   python manage.py shell < create_sample_data.py
   ```

---

## 📍 Postman Requests

### 1. Create New Issue

**Method:** `POST`  
**URL:** `http://localhost:8000/api/issues/`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "title": "Login page not responding",
  "description": "Users are unable to access the login page",
  "status": "open",
  "assignee_id": 1
}
```

**Expected Response (201 Created):**
```json
{
  "id": 6,
  "title": "Login page not responding",
  "description": "Users are unable to access the login page",
  "status": "open",
  "assignee": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "username": "john_doe"
  },
  "assignee_id": 1,
  "created_at": "2026-01-10T06:14:34.123456Z",
  "updated_at": "2026-01-10T06:14:34.123456Z",
  "resolved_at": null,
  "version": 0,
  "comments": [],
  "labels": []
}
```

---

### 2. List Issues (with Filtering & Pagination)

**Method:** `GET`  
**URL:** `http://localhost:8000/api/issues/`

**Query Parameters (optional):**
- `status=open` - Filter by status
- `assignee=1` - Filter by assignee ID
- `search=login` - Search in title/description
- `page=2` - Pagination

**Examples:**
- All issues: `http://localhost:8000/api/issues/`
- Open issues: `http://localhost:8000/api/issues/?status=open`
- Issues assigned to user 1: `http://localhost:8000/api/issues/?assignee=1`
- Search: `http://localhost:8000/api/issues/?search=login`
- Page 2: `http://localhost:8000/api/issues/?page=2`

**Expected Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Login page not working",
      "status": "open",
      "assignee": {
        "id": 1,
        "email": "john@example.com",
        "name": "John Doe",
        "username": "john_doe"
      },
      "created_at": "2026-01-10T05:40:00Z",
      "updated_at": "2026-01-10T05:40:00Z",
      "version": 0,
      "label_count": 3,
      "comment_count": 2
    }
  ]
}
```

---

### 3. Get Issue Detail (with Comments & Labels)

**Method:** `GET`  
**URL:** `http://localhost:8000/api/issues/1/`

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Login page not working",
  "description": "Users are unable to login with valid credentials",
  "status": "open",
  "assignee": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "username": "john_doe"
  },
  "assignee_id": 1,
  "created_at": "2026-01-10T05:40:00Z",
  "updated_at": "2026-01-10T05:40:00Z",
  "resolved_at": null,
  "version": 0,
  "comments": [
    {
      "id": 1,
      "issue": 1,
      "author": {
        "id": 2,
        "email": "jane@example.com",
        "name": "Jane Smith",
        "username": "jane_smith"
      },
      "body": "I can reproduce this issue on Chrome",
      "created_at": "2026-01-10T05:41:00Z"
    }
  ],
  "labels": [
    {
      "id": 1,
      "name": "bug"
    },
    {
      "id": 3,
      "name": "urgent"
    },
    {
      "id": 5,
      "name": "frontend"
    }
  ]
}
```

---

### 4. Update Issue (with Version Check)

**Method:** `PATCH`  
**URL:** `http://localhost:8000/api/issues/1/`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "title": "Login page fixed",
  "status": "resolved",
  "version": 0
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Login page fixed",
  "status": "resolved",
  "version": 1,
  ...
}
```

**⚠️ Version Conflict Test:**

Try updating again with the old version:

**Body:**
```json
{
  "title": "This will fail",
  "version": 0
}
```

**Expected Response (409 Conflict):**
```json
{
  "version": [
    "Conflict: Issue was modified by another user. Please refresh and try again."
  ]
}
```

---

### 5. Add Comment to Issue

**Method:** `POST`  
**URL:** `http://localhost:8000/api/issues/1/comments/`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "body": "This is a test comment from Postman",
  "author_id": 1
}
```

**Expected Response (201 Created):**
```json
{
  "id": 3,
  "issue": 1,
  "author": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "username": "john_doe"
  },
  "body": "This is a test comment from Postman",
  "created_at": "2026-01-10T06:20:00Z"
}
```

---

### 6. Replace Labels Atomically

**Method:** `PUT`  
**URL:** `http://localhost:8000/api/issues/1/labels/`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "labels": ["bug", "urgent", "backend", "critical"]
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "title": "Login page not working",
  "labels": [
    {
      "id": 1,
      "name": "bug"
    },
    {
      "id": 3,
      "name": "urgent"
    },
    {
      "id": 4,
      "name": "backend"
    },
    {
      "id": 7,
      "name": "critical"
    }
  ],
  ...
}
```

**To clear all labels:**
```json
{
  "labels": []
}
```

---

### 7. Bulk Status Update (Transactional)

**Method:** `POST`  
**URL:** `http://localhost:8000/api/issues/bulk-status/`  
**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "issue_ids": [1, 2, 3],
  "status": "resolved"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Successfully updated 3 issues",
  "updated_ids": [1, 2, 3],
  "new_status": "resolved"
}
```

**Error Test (invalid status):**
```json
{
  "issue_ids": [1, 2],
  "status": "invalid_status"
}
```

**Expected Response (400 Bad Request):**
```json
{
  "status": [
    "Invalid status. Must be one of: open, in_progress, resolved, closed"
  ]
}
```

---

### 8. CSV Upload for Issue Import

**Method:** `POST`  
**URL:** `http://localhost:8000/api/issues/import/`  
**Headers:**
- (Postman will auto-set `Content-Type: multipart/form-data`)

**Body (form-data):**
- Key: `file`
- Type: `File`
- Value: Select `sample_issues.csv` from the project directory

**Expected Response (200 OK):**
```json
{
  "total_rows": 5,
  "successful": 4,
  "failed": 1,
  "errors": [
    {
      "row": 3,
      "data": {
        "title": "Fix memory leak",
        "description": "...",
        "status": "urgent",
        "assignee_email": "bob@example.com"
      },
      "error": "Invalid status. Must be one of: open, in_progress, resolved, closed"
    }
  ]
}
```

**CSV File Format (sample_issues.csv):**
```csv
title,description,status,assignee_email
"Database timeout","Connection issues","open","john@example.com"
"Add PDF export","Export feature","open","jane@example.com"
"Memory leak","High memory usage","in_progress","bob@example.com"
```

---

### 9. Top Assignees Report

**Method:** `GET`  
**URL:** `http://localhost:8000/api/reports/top-assignees/`

**Query Parameters (optional):**
- `limit=5` - Number of top assignees to return (default: 10)

**Examples:**
- Default: `http://localhost:8000/api/reports/top-assignees/`
- Top 5: `http://localhost:8000/api/reports/top-assignees/?limit=5`

**Expected Response (200 OK):**
```json
{
  "top_assignees": [
    {
      "user": {
        "id": 1,
        "email": "john@example.com",
        "name": "John Doe",
        "username": "john_doe"
      },
      "issue_count": 3
    },
    {
      "user": {
        "id": 2,
        "email": "jane@example.com",
        "name": "Jane Smith",
        "username": "jane_smith"
      },
      "issue_count": 2
    }
  ],
  "limit": 10
}
```

---

### 10. Resolution Latency Report

**Method:** `GET`  
**URL:** `http://localhost:8000/api/reports/latency/`

**Query Parameters (optional):**
- `status=resolved` - Filter by status (default: resolved)

**Examples:**
- Default: `http://localhost:8000/api/reports/latency/`
- Specific status: `http://localhost:8000/api/reports/latency/?status=closed`

**Expected Response (200 OK):**
```json
{
  "status_filter": "resolved",
  "total_issues": 1,
  "average_resolution_time": {
    "days": 0,
    "hours": 0,
    "minutes": 5,
    "total_seconds": 300.0
  }
}
```

**If no resolved issues:**
```json
{
  "message": "No resolved issues found",
  "average_resolution_time": null
}
```

---

### 11. Issue Timeline (Bonus)

**Method:** `GET`  
**URL:** `http://localhost:8000/api/issues/1/timeline/`

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "change_type": "created",
    "field_name": "",
    "old_value": "",
    "new_value": "Issue created: Login page not working",
    "changed_by": null,
    "changed_at": "2026-01-10T05:40:00Z"
  },
  {
    "id": 2,
    "change_type": "comment_added",
    "field_name": "comment",
    "old_value": "",
    "new_value": "Comment by jane@example.com",
    "changed_by": {
      "id": 2,
      "email": "jane@example.com",
      "name": "Jane Smith",
      "username": "jane_smith"
    },
    "changed_at": "2026-01-10T05:41:00Z"
  },
  {
    "id": 3,
    "change_type": "status_changed",
    "field_name": "status",
    "old_value": "open",
    "new_value": "resolved",
    "changed_by": null,
    "changed_at": "2026-01-10T06:15:00Z"
  }
]
```

---

## 🎯 Testing Workflow

### Step-by-Step Testing Guide

1. **Create a new issue** (POST /api/issues/)
2. **List all issues** (GET /api/issues/)
3. **Get the issue detail** (GET /api/issues/{id}/)
4. **Add a comment** (POST /api/issues/{id}/comments/)
5. **Add labels** (PUT /api/issues/{id}/labels/)
6. **Update the issue** (PATCH /api/issues/{id}/) - Note the version!
7. **Try updating with old version** - Should get 409 Conflict
8. **View timeline** (GET /api/issues/{id}/timeline/)
9. **Bulk update** (POST /api/issues/bulk-status/)
10. **Import CSV** (POST /api/issues/import/)
11. **Check reports** (GET /api/reports/top-assignees/ and /api/reports/latency/)

---

## 📝 Valid Values

### Status Values
- `open`
- `in_progress`
- `resolved`
- `closed`

### User IDs (from sample data)
- `1` - john@example.com
- `2` - jane@example.com
- `3` - bob@example.com

---

## 🐛 Common Errors

### 400 Bad Request
- Missing required fields
- Invalid status value
- Empty comment body
- Invalid data format

### 404 Not Found
- Issue ID doesn't exist
- Invalid endpoint URL

### 409 Conflict
- Version mismatch (optimistic locking)
- Concurrent update detected

---

## 💡 Tips

1. **Save requests in Postman Collection** for reuse
2. **Use environment variables** for base URL
3. **Check response status codes** to verify success
4. **Note the version field** when updating issues
5. **Use the timeline endpoint** to see all changes

---

## 🔧 Postman Environment Setup (Optional)

Create a Postman environment with:

**Variable Name:** `base_url`  
**Value:** `http://localhost:8000/api`

Then use `{{base_url}}/issues/` in your requests.

---

## 📊 Sample Test Scenarios

### Scenario 1: Complete Issue Lifecycle
1. Create issue (status: open)
2. Add comment
3. Add labels
4. Update status to in_progress
5. Add another comment
6. Update status to resolved
7. View timeline

### Scenario 2: Concurrency Test
1. Get issue (note version: 0)
2. Update issue (version: 0) → Success (version: 1)
3. Try updating again with version: 0 → 409 Conflict

### Scenario 3: Bulk Operations
1. Create 5 issues
2. Bulk update 3 of them to "resolved"
3. Check top assignees report
4. Check resolution latency

### Scenario 4: CSV Import
1. Prepare CSV file with 10 issues
2. Include 2 invalid rows (wrong status)
3. Import and verify summary report
4. Check that valid rows were imported

---

## ✅ Verification Checklist

- [ ] Can create issues
- [ ] Can list and filter issues
- [ ] Can get issue details with comments and labels
- [ ] Can update issues (version check works)
- [ ] Version conflict returns 409
- [ ] Can add comments
- [ ] Can replace labels atomically
- [ ] Bulk update works (all or nothing)
- [ ] CSV import validates and reports errors
- [ ] Top assignees report shows correct data
- [ ] Resolution latency calculates correctly
- [ ] Timeline shows all changes

---

Happy Testing! 🚀

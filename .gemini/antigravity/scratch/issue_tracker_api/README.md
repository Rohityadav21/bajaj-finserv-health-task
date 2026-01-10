# Issue Tracker API

A comprehensive backend REST API built with Django, Django REST Framework, and PostgreSQL for managing issues, comments, and labels with advanced features like optimistic concurrency control, transactional bulk updates, CSV imports, and reporting.

## 🎯 Features

- **Issue Management**: Full CRUD operations with filtering and pagination
- **Optimistic Concurrency Control**: Version-based locking to prevent lost updates
- **Comments**: Add and manage comments on issues
- **Labels**: Create and assign labels to issues
- **Bulk Operations**: Transactional bulk status updates with rollback support
- **CSV Import**: Import issues from CSV files with validation and error reporting
- **Reports**: Aggregated reports for top assignees and resolution latency
- **Timeline**: Track complete history of issue changes (bonus feature)

## 🛠️ Tech Stack

- **Language**: Python 3.8+
- **Framework**: Django 4.2+ with Django REST Framework 3.14+
- **Database**: PostgreSQL (with SQLite fallback for development)
- **ORM**: Django ORM
- **API Style**: REST
- **Testing**: Django TestCase with comprehensive test coverage

## 📋 Prerequisites

- Python 3.8 or higher
- PostgreSQL (optional - SQLite is used by default for development)
- pip and virtualenv

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd /Users/rohit/.gemini/antigravity/scratch/issue_tracker_api

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

**Option A: SQLite (Default - No setup required)**

The project uses SQLite by default for easy development.

**Option B: PostgreSQL (Production)**

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb issue_tracker_db

# Set environment variable
export USE_POSTGRES=true
```

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/
```

### Authentication

Currently, the API does not require authentication (for development). In production, you should add authentication using DRF's token or session authentication.

---

## 📍 Endpoints

### Issues

#### Create Issue

```http
POST /api/issues/
Content-Type: application/json

{
  "title": "Bug in login page",
  "description": "Users cannot login with valid credentials",
  "status": "open",
  "assignee_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "Bug in login page",
  "description": "Users cannot login with valid credentials",
  "status": "open",
  "assignee": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe"
  },
  "assignee_id": 1,
  "created_at": "2026-01-10T10:00:00Z",
  "updated_at": "2026-01-10T10:00:00Z",
  "resolved_at": null,
  "version": 0,
  "comments": [],
  "labels": []
}
```

#### List Issues

```http
GET /api/issues/
GET /api/issues/?status=open
GET /api/issues/?assignee=1
GET /api/issues/?search=login
GET /api/issues/?page=2
```

**Response** (200 OK):
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/issues/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Bug in login page",
      "status": "open",
      "assignee": {...},
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z",
      "version": 0,
      "label_count": 2,
      "comment_count": 5
    }
  ]
}
```

#### Get Issue Detail

```http
GET /api/issues/{id}/
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Bug in login page",
  "description": "Users cannot login with valid credentials",
  "status": "open",
  "assignee": {...},
  "created_at": "2026-01-10T10:00:00Z",
  "updated_at": "2026-01-10T10:00:00Z",
  "resolved_at": null,
  "version": 0,
  "comments": [
    {
      "id": 1,
      "author": {...},
      "body": "I can reproduce this issue",
      "created_at": "2026-01-10T10:05:00Z"
    }
  ],
  "labels": [
    {"id": 1, "name": "bug"},
    {"id": 2, "name": "urgent"}
  ]
}
```

#### Update Issue (with Optimistic Locking)

```http
PATCH /api/issues/{id}/
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "version": 0
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated title",
  "status": "in_progress",
  "version": 1,
  ...
}
```

**Response** (409 Conflict) - Version mismatch:
```json
{
  "version": ["Conflict: Issue was modified by another user. Please refresh and try again."]
}
```

#### Delete Issue

```http
DELETE /api/issues/{id}/
```

**Response** (204 No Content)

---

### Comments

#### Add Comment to Issue

```http
POST /api/issues/{id}/comments/
Content-Type: application/json

{
  "body": "This is a comment",
  "author_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "issue": 1,
  "author": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe"
  },
  "body": "This is a comment",
  "created_at": "2026-01-10T10:05:00Z"
}
```

---

### Labels

#### Replace Issue Labels

```http
PUT /api/issues/{id}/labels/
Content-Type: application/json

{
  "labels": ["bug", "urgent", "backend"]
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Bug in login page",
  "labels": [
    {"id": 1, "name": "bug"},
    {"id": 2, "name": "urgent"},
    {"id": 3, "name": "backend"}
  ],
  ...
}
```

---

### Bulk Operations

#### Bulk Status Update

```http
POST /api/issues/bulk-status/
Content-Type: application/json

{
  "issue_ids": [1, 2, 3, 4, 5],
  "status": "resolved"
}
```

**Response** (200 OK):
```json
{
  "message": "Successfully updated 5 issues",
  "updated_ids": [1, 2, 3, 4, 5],
  "new_status": "resolved"
}
```

**Response** (400 Bad Request) - Validation error:
```json
{
  "issue_ids": ["Issues not found: [99, 100]"]
}
```

---

### CSV Import

#### Import Issues from CSV

```http
POST /api/issues/import/
Content-Type: multipart/form-data

file: <CSV file>
```

**CSV Format**:
```csv
title,description,status,assignee_email
"Bug in login","Users cannot login","open","user@example.com"
"Feature request","Add dark mode","open",""
```

**Response** (200 OK):
```json
{
  "total_rows": 100,
  "successful": 95,
  "failed": 5,
  "errors": [
    {
      "row": 3,
      "data": {...},
      "error": "Invalid status. Must be one of: open, in_progress, resolved, closed"
    },
    {
      "row": 7,
      "data": {...},
      "error": "User with email invalid@example.com not found."
    }
  ]
}
```

---

### Reports

#### Top Assignees

```http
GET /api/reports/top-assignees/
GET /api/reports/top-assignees/?limit=5
```

**Response** (200 OK):
```json
{
  "top_assignees": [
    {
      "user": {
        "id": 1,
        "email": "user1@example.com",
        "name": "User 1",
        "username": "user1"
      },
      "issue_count": 25
    },
    {
      "user": {
        "id": 2,
        "email": "user2@example.com",
        "name": "User 2",
        "username": "user2"
      },
      "issue_count": 18
    }
  ],
  "limit": 10
}
```

#### Resolution Latency

```http
GET /api/reports/latency/
GET /api/reports/latency/?status=resolved
```

**Response** (200 OK):
```json
{
  "status_filter": "resolved",
  "total_issues": 150,
  "average_resolution_time": {
    "days": 3,
    "hours": 5,
    "minutes": 30,
    "total_seconds": 278100.0
  }
}
```

---

### Timeline (Bonus Feature)

#### Get Issue Timeline

```http
GET /api/issues/{id}/timeline/
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "change_type": "created",
    "field_name": "",
    "old_value": "",
    "new_value": "Issue created: Bug in login page",
    "changed_by": null,
    "changed_at": "2026-01-10T10:00:00Z"
  },
  {
    "id": 2,
    "change_type": "status_changed",
    "field_name": "status",
    "old_value": "open",
    "new_value": "in_progress",
    "changed_by": {...},
    "changed_at": "2026-01-10T11:00:00Z"
  },
  {
    "id": 3,
    "change_type": "comment_added",
    "field_name": "comment",
    "old_value": "",
    "new_value": "Comment by user@example.com",
    "changed_by": {...},
    "changed_at": "2026-01-10T11:30:00Z"
  }
]
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT NOW()
);
```

### Issues Table
```sql
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP NULL,
    version INTEGER DEFAULT 0
);

CREATE INDEX issues_status_idx ON issues(status);
CREATE INDEX issues_assignee_idx ON issues(assignee_id);
CREATE INDEX issues_created_at_idx ON issues(created_at);
```

### Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Labels Table
```sql
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
```

### Issue_Labels Table
```sql
CREATE TABLE issue_labels (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
    UNIQUE(issue_id, label_id)
);

CREATE INDEX issue_labels_issue_idx ON issue_labels(issue_id);
CREATE INDEX issue_labels_label_idx ON issue_labels(label_id);
```

### Issue_History Table
```sql
CREATE TABLE issue_history (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    change_type VARCHAR(20) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX issue_history_issue_changed_at_idx ON issue_history(issue_id, changed_at);
```

---

## 🧪 Testing

### Run All Tests

```bash
python manage.py test
```

### Run Specific Test Suites

```bash
# Model tests
python manage.py test api.tests.test_models

# API endpoint tests
python manage.py test api.tests.test_views

# Concurrency tests
python manage.py test api.tests.test_concurrency

# CSV import tests
python manage.py test api.tests.test_csv_import
```

### Test Coverage

The test suite includes:
- ✅ Model validation and constraints
- ✅ CRUD operations
- ✅ Filtering and pagination
- ✅ Optimistic concurrency control
- ✅ Transaction rollback
- ✅ CSV import validation
- ✅ Report generation
- ✅ Timeline tracking

---

## 🔒 Optimistic Concurrency Control

The API uses version-based optimistic locking to prevent lost updates:

1. Each issue has a `version` field (starts at 0)
2. When updating an issue, you must provide the current version
3. If the version doesn't match, the update fails with 409 Conflict
4. On successful update, the version is incremented

**Example Workflow**:

```python
# User A gets issue
GET /api/issues/1/
# Response: {"id": 1, "title": "Bug", "version": 0}

# User B gets the same issue
GET /api/issues/1/
# Response: {"id": 1, "title": "Bug", "version": 0}

# User A updates successfully
PATCH /api/issues/1/
{"title": "Updated Bug", "version": 0}
# Response: {"id": 1, "title": "Updated Bug", "version": 1}

# User B tries to update with stale version
PATCH /api/issues/1/
{"title": "Different Update", "version": 0}
# Response 409: {"version": ["Conflict: Issue was modified..."]}

# User B must refresh and retry
GET /api/issues/1/
# Response: {"id": 1, "title": "Updated Bug", "version": 1}

PATCH /api/issues/1/
{"title": "Different Update", "version": 1}
# Response: {"id": 1, "title": "Different Update", "version": 2}
```

---

## 🔄 Transaction Support

Bulk operations use database transactions to ensure atomicity:

- **Bulk Status Update**: All issues are updated or none (rollback on error)
- **Label Replacement**: Labels are removed and added atomically
- **CSV Import**: Each row is independent (partial success allowed)

---

## 📊 Status Values

Valid issue statuses:
- `open`
- `in_progress`
- `resolved`
- `closed`

---

## 🎨 Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to:
- Manage users, issues, comments, and labels
- View issue history
- Perform administrative tasks

---

## 🔧 Configuration

### Environment Variables

```bash
# Use PostgreSQL instead of SQLite
export USE_POSTGRES=true

# PostgreSQL configuration (when USE_POSTGRES=true)
export DB_NAME=issue_tracker_db
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432
```

### Settings

Key settings in `issue_tracker/settings.py`:
- `PAGE_SIZE`: Number of items per page (default: 20)
- `AUTH_USER_MODEL`: Custom user model
- `DEFAULT_FILTER_BACKENDS`: DRF filter backends

---

## 📝 Project Structure

```
issue_tracker_api/
├── api/
│   ├── migrations/
│   ├── tests/
│   │   ├── test_models.py
│   │   ├── test_views.py
│   │   ├── test_concurrency.py
│   │   └── test_csv_import.py
│   ├── admin.py
│   ├── exceptions.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
├── issue_tracker/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🚀 Deployment Considerations

For production deployment:

1. **Security**:
   - Set `DEBUG = False`
   - Use strong `SECRET_KEY`
   - Configure `ALLOWED_HOSTS`
   - Add authentication (Token/JWT)
   - Enable HTTPS

2. **Database**:
   - Use PostgreSQL
   - Configure connection pooling
   - Set up regular backups

3. **Performance**:
   - Enable caching (Redis)
   - Use database query optimization
   - Configure static file serving

4. **Monitoring**:
   - Set up logging
   - Add error tracking (Sentry)
   - Monitor database performance

---

## 📄 License

This project is created for educational purposes.

---

## 👥 Contributing

This is a demonstration project. For production use, consider adding:
- Authentication and authorization
- Rate limiting
- API versioning
- Webhooks for issue events
- Email notifications
- File attachments
- Advanced search with Elasticsearch

---

## 📞 Support

For issues or questions, please refer to the Django and DRF documentation:
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

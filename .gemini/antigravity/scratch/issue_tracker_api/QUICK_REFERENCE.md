# Issue Tracker API - Quick Reference

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd /Users/rohit/.gemini/antigravity/scratch/issue_tracker_api

# Activate virtual environment
source venv/bin/activate

# Run migrations (first time only)
python manage.py migrate

# Create sample data (optional)
python manage.py shell < create_sample_data.py

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Create superuser for admin access
python manage.py createsuperuser
```

## 📍 Common API Operations

### Create an Issue
```bash
curl -X POST http://localhost:8000/api/issues/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Bug",
    "description": "Description here",
    "status": "open"
  }'
```

### List All Issues
```bash
curl http://localhost:8000/api/issues/
```

### Filter Issues by Status
```bash
curl http://localhost:8000/api/issues/?status=open
```

### Get Issue Detail
```bash
curl http://localhost:8000/api/issues/1/
```

### Update Issue (with version)
```bash
curl -X PATCH http://localhost:8000/api/issues/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "in_progress",
    "version": 0
  }'
```

### Add Comment
```bash
curl -X POST http://localhost:8000/api/issues/1/comments/ \
  -H "Content-Type: application/json" \
  -d '{
    "body": "This is a comment",
    "author_id": 1
  }'
```

### Add Labels
```bash
curl -X PUT http://localhost:8000/api/issues/1/labels/ \
  -H "Content-Type: application/json" \
  -d '{
    "labels": ["bug", "urgent"]
  }'
```

### Bulk Status Update
```bash
curl -X POST http://localhost:8000/api/issues/bulk-status/ \
  -H "Content-Type: application/json" \
  -d '{
    "issue_ids": [1, 2, 3],
    "status": "resolved"
  }'
```

### Import from CSV
```bash
curl -X POST http://localhost:8000/api/issues/import/ \
  -F "file=@sample_issues.csv"
```

### Get Top Assignees
```bash
curl http://localhost:8000/api/reports/top-assignees/?limit=5
```

### Get Resolution Latency
```bash
curl http://localhost:8000/api/reports/latency/
```

### Get Issue Timeline
```bash
curl http://localhost:8000/api/issues/1/timeline/
```

## 🗄️ Database Commands

### Using SQLite (Default)
```bash
# No setup needed - just run migrations
python manage.py migrate
```

### Using PostgreSQL
```bash
# Set environment variable
export USE_POSTGRES=true

# Create database (if not exists)
createdb issue_tracker_db

# Run migrations
python manage.py migrate
```

## 🧪 Testing Commands

```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test api.tests.test_models

# Run with verbose output
python manage.py test -v 2

# Run specific test class
python manage.py test api.tests.test_views.IssueAPITest

# Run specific test method
python manage.py test api.tests.test_views.IssueAPITest.test_create_issue
```

## 🔧 Development Commands

```bash
# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Open Django shell
python manage.py shell

# Create superuser
python manage.py createsuperuser

# Collect static files (for production)
python manage.py collectstatic
```

## 📊 Admin Interface

Access at: `http://localhost:8000/admin/`

Login with superuser credentials created via:
```bash
python manage.py createsuperuser
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or run on different port
python manage.py runserver 8080
```

### Database locked (SQLite)
```bash
# Remove database and recreate
rm db.sqlite3
python manage.py migrate
python manage.py shell < create_sample_data.py
```

### Import errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## 📝 Status Values

Valid status values for issues:
- `open`
- `in_progress`
- `resolved`
- `closed`

## 🔑 Important URLs

- API Base: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- Issues: `http://localhost:8000/api/issues/`
- Reports: `http://localhost:8000/api/reports/`

## 📚 Additional Resources

- [README.md](README.md) - Complete documentation
- [walkthrough.md](walkthrough.md) - Project walkthrough
- [Django Docs](https://docs.djangoproject.com/)
- [DRF Docs](https://www.django-rest-framework.org/)

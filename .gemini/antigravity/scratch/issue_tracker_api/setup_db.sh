#!/bin/bash

# Database setup script for Issue Tracker API

echo "Setting up Issue Tracker API database..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "PostgreSQL is not running. Please start PostgreSQL first."
    echo "On macOS with Homebrew: brew services start postgresql"
    exit 1
fi

# Create database
echo "Creating database 'issue_tracker_db'..."
createdb issue_tracker_db 2>/dev/null || echo "Database already exists or creation failed. Continuing..."

# Create PostgreSQL user if needed (optional)
# psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || echo "User already exists."

echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run migrations: python manage.py makemigrations && python manage.py migrate"
echo "3. Create superuser: python manage.py createsuperuser"
echo "4. Run server: python manage.py runserver"

"""
Sample data creation script for Issue Tracker API.
Run with: python manage.py shell < create_sample_data.py
"""

from api.models import User, Issue, Comment, Label, IssueLabel

# Create users
print("Creating users...")
user1 = User.objects.create_user(
    username='john_doe',
    email='john@example.com',
    password='password123',
    name='John Doe'
)

user2 = User.objects.create_user(
    username='jane_smith',
    email='jane@example.com',
    password='password123',
    name='Jane Smith'
)

user3 = User.objects.create_user(
    username='bob_wilson',
    email='bob@example.com',
    password='password123',
    name='Bob Wilson'
)

print(f"Created {User.objects.count()} users")

# Create labels
print("\nCreating labels...")
labels = []
for label_name in ['bug', 'feature', 'urgent', 'backend', 'frontend', 'documentation']:
    label, created = Label.objects.get_or_create(name=label_name)
    labels.append(label)

print(f"Created {Label.objects.count()} labels")

# Create issues
print("\nCreating issues...")
issues_data = [
    {
        'title': 'Login page not working',
        'description': 'Users are unable to login with valid credentials',
        'status': 'open',
        'assignee': user1,
        'labels': ['bug', 'urgent', 'frontend']
    },
    {
        'title': 'Add dark mode support',
        'description': 'Implement dark mode theme for the application',
        'status': 'in_progress',
        'assignee': user2,
        'labels': ['feature', 'frontend']
    },
    {
        'title': 'API response time is slow',
        'description': 'Database queries are taking too long',
        'status': 'open',
        'assignee': user1,
        'labels': ['bug', 'backend', 'urgent']
    },
    {
        'title': 'Update API documentation',
        'description': 'Add examples for all endpoints',
        'status': 'resolved',
        'assignee': user3,
        'labels': ['documentation']
    },
    {
        'title': 'Implement user profile page',
        'description': 'Create a page where users can edit their profile',
        'status': 'open',
        'assignee': user2,
        'labels': ['feature', 'frontend']
    },
]

for issue_data in issues_data:
    label_names = issue_data.pop('labels')
    issue = Issue.objects.create(**issue_data)
    
    # Add labels
    for label_name in label_names:
        label = Label.objects.get(name=label_name)
        IssueLabel.objects.create(issue=issue, label=label)

print(f"Created {Issue.objects.count()} issues")

# Create comments
print("\nCreating comments...")
issue1 = Issue.objects.first()
Comment.objects.create(
    issue=issue1,
    author=user2,
    body="I can reproduce this issue on Chrome"
)
Comment.objects.create(
    issue=issue1,
    author=user3,
    body="This is a critical bug, needs immediate attention"
)

print(f"Created {Comment.objects.count()} comments")

print("\n✅ Sample data created successfully!")
print("\nSummary:")
print(f"  Users: {User.objects.count()}")
print(f"  Issues: {Issue.objects.count()}")
print(f"  Comments: {Comment.objects.count()}")
print(f"  Labels: {Label.objects.count()}")
print(f"\nYou can now test the API at http://localhost:8000/api/")

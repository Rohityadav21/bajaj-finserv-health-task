"""
Add Rohit Yadav and 20+ additional records to the database.
Run with: python manage.py shell < add_more_data.py
"""

from api.models import User, Issue, Comment, Label, IssueLabel

print("🚀 Adding Rohit Yadav and additional data...\n")

# Create Rohit Yadav as a user
print("Creating user: Rohit Yadav...")
rohit = User.objects.create_user(
    username='rohityadav',
    email='rohityadav36001@gmail.com',
    password='password123',
    name='Rohit Yadav'
)
print(f"✅ Created: {rohit.name} (ID: {rohit.id}, Email: {rohit.email})")

# Create additional users
print("\nCreating additional users...")
additional_users = [
    {'username': 'alice_wonder', 'email': 'alice@example.com', 'name': 'Alice Wonder'},
    {'username': 'bob_builder', 'email': 'bob.builder@example.com', 'name': 'Bob Builder'},
    {'username': 'charlie_brown', 'email': 'charlie@example.com', 'name': 'Charlie Brown'},
    {'username': 'diana_prince', 'email': 'diana@example.com', 'name': 'Diana Prince'},
    {'username': 'eve_online', 'email': 'eve@example.com', 'name': 'Eve Online'},
]

created_users = [rohit]
for user_data in additional_users:
    user = User.objects.create_user(
        username=user_data['username'],
        email=user_data['email'],
        password='password123',
        name=user_data['name']
    )
    created_users.append(user)
    print(f"✅ Created: {user.name} (ID: {user.id})")

# Get all users for assignment
all_users = User.objects.all()

# Create additional labels
print("\nCreating additional labels...")
new_labels = ['critical', 'enhancement', 'question', 'wontfix', 'duplicate', 'help-wanted', 'good-first-issue']
for label_name in new_labels:
    label, created = Label.objects.get_or_create(name=label_name)
    if created:
        print(f"✅ Created label: {label_name}")

# Create 20+ issues with variety
print("\nCreating 20+ issues...")
issues_data = [
    {
        'title': 'API endpoint returns 500 error',
        'description': 'The /api/users endpoint is throwing internal server errors',
        'status': 'open',
        'assignee': rohit,
        'labels': ['bug', 'critical', 'backend']
    },
    {
        'title': 'Add user profile picture upload',
        'description': 'Users should be able to upload profile pictures',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Improve search performance',
        'description': 'Search queries are taking more than 5 seconds',
        'status': 'in_progress',
        'assignee': rohit,
        'labels': ['bug', 'backend']
    },
    {
        'title': 'Mobile app crashes on startup',
        'description': 'iOS app crashes immediately after launch',
        'status': 'open',
        'assignee': created_users[1],
        'labels': ['bug', 'critical', 'frontend']
    },
    {
        'title': 'Add dark mode toggle',
        'description': 'Implement system-wide dark mode',
        'status': 'in_progress',
        'assignee': created_users[2],
        'labels': ['feature', 'frontend']
    },
    {
        'title': 'Database migration failed',
        'description': 'Migration 0045 is failing on production',
        'status': 'resolved',
        'assignee': created_users[3],
        'labels': ['bug', 'backend', 'critical']
    },
    {
        'title': 'Add two-factor authentication',
        'description': 'Implement 2FA for enhanced security',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Fix memory leak in background worker',
        'description': 'Worker process memory grows indefinitely',
        'status': 'in_progress',
        'assignee': created_users[4],
        'labels': ['bug', 'critical', 'backend']
    },
    {
        'title': 'Update documentation for API v2',
        'description': 'API v2 documentation is outdated',
        'status': 'open',
        'assignee': created_users[5],
        'labels': ['documentation']
    },
    {
        'title': 'Add export to CSV feature',
        'description': 'Users want to export data as CSV',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Login page not responsive on mobile',
        'description': 'Login form breaks on small screens',
        'status': 'open',
        'assignee': created_users[1],
        'labels': ['bug', 'frontend', 'urgent']
    },
    {
        'title': 'Implement rate limiting',
        'description': 'Add rate limiting to prevent abuse',
        'status': 'in_progress',
        'assignee': rohit,
        'labels': ['feature', 'backend']
    },
    {
        'title': 'Add email notifications',
        'description': 'Send email when issue is assigned',
        'status': 'open',
        'assignee': created_users[2],
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Fix broken image links',
        'description': 'Several images return 404',
        'status': 'resolved',
        'assignee': created_users[3],
        'labels': ['bug', 'frontend']
    },
    {
        'title': 'Add pagination to comments',
        'description': 'Comments section needs pagination',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'frontend']
    },
    {
        'title': 'Optimize database queries',
        'description': 'N+1 query problem in issue list',
        'status': 'in_progress',
        'assignee': created_users[4],
        'labels': ['bug', 'backend']
    },
    {
        'title': 'Add webhook support',
        'description': 'Allow webhooks for issue events',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Fix timezone display issues',
        'description': 'Timestamps showing in wrong timezone',
        'status': 'open',
        'assignee': created_users[5],
        'labels': ['bug', 'frontend']
    },
    {
        'title': 'Add file attachment support',
        'description': 'Users should be able to attach files to issues',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Implement caching layer',
        'description': 'Add Redis caching for better performance',
        'status': 'in_progress',
        'assignee': created_users[1],
        'labels': ['feature', 'backend']
    },
    {
        'title': 'Fix CORS errors',
        'description': 'Frontend getting CORS errors',
        'status': 'resolved',
        'assignee': created_users[2],
        'labels': ['bug', 'backend']
    },
    {
        'title': 'Add user activity log',
        'description': 'Track all user actions for audit',
        'status': 'open',
        'assignee': rohit,
        'labels': ['feature', 'enhancement']
    },
    {
        'title': 'Improve error messages',
        'description': 'Error messages are not user-friendly',
        'status': 'open',
        'assignee': created_users[3],
        'labels': ['enhancement', 'frontend']
    },
]

created_issues = []
for idx, issue_data in enumerate(issues_data, 1):
    label_names = issue_data.pop('labels')
    issue = Issue.objects.create(**issue_data)
    created_issues.append(issue)
    
    # Add labels
    for label_name in label_names:
        label = Label.objects.get(name=label_name)
        IssueLabel.objects.create(issue=issue, label=label)
    
    print(f"✅ Created issue {idx}: {issue.title}")

# Add comments to some issues
print("\nAdding comments to issues...")
comments_data = [
    {'issue': created_issues[0], 'author': rohit, 'body': 'I will investigate this issue today'},
    {'issue': created_issues[0], 'author': created_users[1], 'body': 'This is blocking our deployment'},
    {'issue': created_issues[1], 'author': rohit, 'body': 'Working on the implementation'},
    {'issue': created_issues[2], 'author': created_users[2], 'body': 'We should add database indexing'},
    {'issue': created_issues[3], 'author': created_users[1], 'body': 'Crash logs attached in Jira'},
    {'issue': created_issues[4], 'author': created_users[2], 'body': 'UI mockups are ready'},
    {'issue': created_issues[6], 'author': rohit, 'body': 'Researching best 2FA libraries'},
    {'issue': created_issues[9], 'author': rohit, 'body': 'CSV export should include all fields'},
    {'issue': created_issues[11], 'author': rohit, 'body': 'Implementing using Django rate limiting'},
    {'issue': created_issues[14], 'author': rohit, 'body': 'Should we paginate at 10 or 20 comments?'},
]

for comment_data in comments_data:
    comment = Comment.objects.create(**comment_data)
    print(f"✅ Added comment by {comment.author.name} on issue #{comment.issue.id}")

# Print summary
print("\n" + "="*60)
print("✨ DATA POPULATION COMPLETE!")
print("="*60)
print(f"\n📊 Summary:")
print(f"  Total Users: {User.objects.count()}")
print(f"  Total Issues: {Issue.objects.count()}")
print(f"  Total Comments: {Comment.objects.count()}")
print(f"  Total Labels: {Label.objects.count()}")
print(f"\n👤 Rohit Yadav Details:")
print(f"  ID: {rohit.id}")
print(f"  Email: {rohit.email}")
print(f"  Username: {rohit.username}")
print(f"  Issues Assigned: {Issue.objects.filter(assignee=rohit).count()}")
print(f"\n🎯 You can now use assignee_id={rohit.id} in Postman!")
print(f"\n🔗 Test URLs:")
print(f"  All issues: http://localhost:8000/api/issues/")
print(f"  Rohit's issues: http://localhost:8000/api/issues/?assignee={rohit.id}")
print(f"  All users: http://localhost:8000/api/users/")
print(f"  Rohit's profile: http://localhost:8000/api/users/{rohit.id}/")
print("\n✅ Done! Happy testing! 🚀\n")

from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import User, Issue, Comment, Label, IssueLabel


class UserModelTest(TestCase):
    """Test User model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
    
    def test_user_creation(self):
        """Test user is created correctly."""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(str(self.user), 'test@example.com')
    
    def test_email_unique(self):
        """Test email uniqueness constraint."""
        with self.assertRaises(Exception):
            User.objects.create_user(
                username='testuser2',
                email='test@example.com',
                password='testpass123',
                name='Test User 2'
            )


class IssueModelTest(TestCase):
    """Test Issue model."""
    
    def setUp(self):
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
            assignee=self.user
        )
    
    def test_issue_creation(self):
        """Test issue is created correctly."""
        self.assertEqual(self.issue.title, 'Test Issue')
        self.assertEqual(self.issue.status, 'open')
        self.assertEqual(self.issue.version, 0)
        self.assertIsNone(self.issue.resolved_at)
    
    def test_issue_version_increment(self):
        """Test version field for optimistic locking."""
        original_version = self.issue.version
        self.issue.title = 'Updated Title'
        self.issue.version += 1
        self.issue.save()
        self.assertEqual(self.issue.version, original_version + 1)
    
    def test_resolved_at_auto_set(self):
        """Test resolved_at is set when status changes to resolved."""
        self.issue.status = 'resolved'
        self.issue.save()
        self.assertIsNotNone(self.issue.resolved_at)
    
    def test_resolved_at_cleared(self):
        """Test resolved_at is cleared when status changes from resolved."""
        self.issue.status = 'resolved'
        self.issue.save()
        self.assertIsNotNone(self.issue.resolved_at)
        
        self.issue.status = 'open'
        self.issue.save()
        self.assertIsNone(self.issue.resolved_at)


class CommentModelTest(TestCase):
    """Test Comment model."""
    
    def setUp(self):
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
    
    def test_comment_creation(self):
        """Test comment is created correctly."""
        comment = Comment.objects.create(
            issue=self.issue,
            author=self.user,
            body='Test comment'
        )
        self.assertEqual(comment.body, 'Test comment')
        self.assertEqual(comment.issue, self.issue)
        self.assertEqual(comment.author, self.user)
    
    def test_empty_comment_validation(self):
        """Test that empty comments are rejected."""
        comment = Comment(
            issue=self.issue,
            author=self.user,
            body=''
        )
        with self.assertRaises(ValidationError):
            comment.save()


class LabelModelTest(TestCase):
    """Test Label model."""
    
    def test_label_creation(self):
        """Test label is created correctly."""
        label = Label.objects.create(name='bug')
        self.assertEqual(label.name, 'bug')
        self.assertEqual(str(label), 'bug')
    
    def test_label_unique(self):
        """Test label name uniqueness."""
        Label.objects.create(name='bug')
        with self.assertRaises(Exception):
            Label.objects.create(name='bug')


class IssueLabelModelTest(TestCase):
    """Test IssueLabel model."""
    
    def setUp(self):
        self.issue = Issue.objects.create(
            title='Test Issue',
            description='Test Description',
            status='open'
        )
        self.label = Label.objects.create(name='bug')
    
    def test_issue_label_creation(self):
        """Test issue-label relationship."""
        issue_label = IssueLabel.objects.create(
            issue=self.issue,
            label=self.label
        )
        self.assertEqual(issue_label.issue, self.issue)
        self.assertEqual(issue_label.label, self.label)
    
    def test_unique_together_constraint(self):
        """Test unique_together constraint."""
        IssueLabel.objects.create(issue=self.issue, label=self.label)
        with self.assertRaises(Exception):
            IssueLabel.objects.create(issue=self.issue, label=self.label)

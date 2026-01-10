from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    """
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    # Override username to make email the primary identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Issue(models.Model):
    """
    Issue model with optimistic locking support via version field.
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_issues'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    version = models.IntegerField(default=0)  # For optimistic locking

    def save(self, *args, **kwargs):
        # Auto-set resolved_at when status changes to resolved
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        elif self.status != 'resolved':
            self.resolved_at = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id}: {self.title}"

    class Meta:
        db_table = 'issues'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['assignee']),
            models.Index(fields=['created_at']),
            models.Index(fields=['-created_at']),
        ]


class Comment(models.Model):
    """
    Comment model for issue discussions.
    """
    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.body or not self.body.strip():
            raise ValidationError({'body': 'Comment body cannot be empty.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Comment by {self.author.email} on Issue {self.issue.id}"

    class Meta:
        db_table = 'comments'
        ordering = ['created_at']


class Label(models.Model):
    """
    Label model with unique name constraint.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'labels'
        ordering = ['name']


class IssueLabel(models.Model):
    """
    Many-to-many relationship between Issues and Labels.
    """
    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE,
        related_name='issue_labels'
    )
    label = models.ForeignKey(
        Label,
        on_delete=models.CASCADE,
        related_name='issue_labels'
    )

    def __str__(self):
        return f"{self.issue.title} - {self.label.name}"

    class Meta:
        db_table = 'issue_labels'
        unique_together = [('issue', 'label')]
        indexes = [
            models.Index(fields=['issue']),
            models.Index(fields=['label']),
        ]


class IssueHistory(models.Model):
    """
    Track changes to issues for timeline feature.
    """
    CHANGE_TYPES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('status_changed', 'Status Changed'),
        ('assignee_changed', 'Assignee Changed'),
        ('label_added', 'Label Added'),
        ('label_removed', 'Label Removed'),
        ('comment_added', 'Comment Added'),
    ]

    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE,
        related_name='history'
    )
    change_type = models.CharField(max_length=20, choices=CHANGE_TYPES)
    field_name = models.CharField(max_length=100, blank=True)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='issue_changes'
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.change_type} on Issue {self.issue.id} at {self.changed_at}"

    class Meta:
        db_table = 'issue_history'
        ordering = ['changed_at']
        indexes = [
            models.Index(fields=['issue', 'changed_at']),
        ]

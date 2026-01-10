from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Issue, Comment, Label, IssueLabel, IssueHistory


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    list_display = ['email', 'name', 'username', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['email', 'name', 'username']
    ordering = ['email']


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    """Admin configuration for Issue model."""
    list_display = ['id', 'title', 'status', 'assignee', 'created_at', 'version']
    list_filter = ['status', 'created_at', 'assignee']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at', 'version']
    date_hierarchy = 'created_at'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin configuration for Comment model."""
    list_display = ['id', 'issue', 'author', 'created_at']
    list_filter = ['created_at', 'author']
    search_fields = ['body', 'author__email']
    readonly_fields = ['created_at']


@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    """Admin configuration for Label model."""
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(IssueLabel)
class IssueLabelAdmin(admin.ModelAdmin):
    """Admin configuration for IssueLabel model."""
    list_display = ['id', 'issue', 'label']
    list_filter = ['label']
    search_fields = ['issue__title', 'label__name']


@admin.register(IssueHistory)
class IssueHistoryAdmin(admin.ModelAdmin):
    """Admin configuration for IssueHistory model."""
    list_display = ['id', 'issue', 'change_type', 'changed_by', 'changed_at']
    list_filter = ['change_type', 'changed_at']
    search_fields = ['issue__title', 'changed_by__email']
    readonly_fields = ['changed_at']

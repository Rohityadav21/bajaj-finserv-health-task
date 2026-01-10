from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    IssueViewSet, UserViewSet, BulkStatusUpdateView,
    IssueImportView, TopAssigneesView, ResolutionLatencyView
)

router = DefaultRouter()
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Specific paths must come before router.urls to avoid conflicts
    path('issues/bulk-status/', BulkStatusUpdateView.as_view(), name='bulk-status-update'),
    path('issues/import/', IssueImportView.as_view(), name='issue-import'),
    path('reports/top-assignees/', TopAssigneesView.as_view(), name='top-assignees'),
    path('reports/latency/', ResolutionLatencyView.as_view(), name='resolution-latency'),
    # Router URLs
    path('', include(router.urls)),
]

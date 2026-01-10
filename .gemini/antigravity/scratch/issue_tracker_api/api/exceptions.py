from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that handles concurrency conflicts
    and other custom exceptions.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Handle Django ValidationError
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, 'message_dict'):
            return Response(exc.message_dict, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': exc.messages}, status=status.HTTP_400_BAD_REQUEST)

    # Handle version conflict (optimistic locking)
    if response is not None:
        # Check if this is a version conflict error
        if isinstance(response.data, dict) and 'version' in response.data:
            # Check if the error message contains conflict-related text
            version_error = response.data.get('version')
            if version_error and any(keyword in str(version_error).lower() for keyword in ['conflict', 'modified']):
                response.status_code = status.HTTP_409_CONFLICT

    return response

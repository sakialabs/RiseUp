"""Custom exceptions and error handling for RiseUp Collective API."""

from typing import Any, Dict, Optional
from datetime import datetime


class RiseUpException(Exception):
    """Base exception for all RiseUp application errors."""
    
    def __init__(
        self,
        message: str,
        code: str,
        status_code: int,
        field: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.field = field
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(RiseUpException):
    """Raised when input validation fails."""
    
    def __init__(
        self,
        message: str,
        field: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=400,
            field=field,
            details=details
        )


class AuthenticationException(RiseUpException):
    """Raised when authentication fails."""
    
    def __init__(
        self,
        message: str = "Invalid credentials",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            code="AUTHENTICATION_ERROR",
            status_code=401,
            details=details
        )


class AuthorizationException(RiseUpException):
    """Raised when user lacks permission for an action."""
    
    def __init__(
        self,
        message: str = "You do not have permission to perform this action",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            code="AUTHORIZATION_ERROR",
            status_code=403,
            details=details
        )


class NotFoundException(RiseUpException):
    """Raised when a requested resource is not found."""
    
    def __init__(
        self,
        resource: str,
        resource_id: Any,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=f"{resource} not found",
            code="NOT_FOUND",
            status_code=404,
            field=resource_id,
            details=details or {"resource": resource, "id": resource_id}
        )


class ConflictException(RiseUpException):
    """Raised when there's a conflict, like duplicate resources."""
    
    def __init__(
        self,
        message: str,
        field: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=409,
            field=field,
            details=details
        )


class ServerException(RiseUpException):
    """Raised when an internal server error occurs."""
    
    def __init__(
        self,
        message: str = "An internal server error occurred",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            code="INTERNAL_SERVER_ERROR",
            status_code=500,
            details=details
        )


def create_error_response(
    code: str,
    message: str,
    field: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Create a standardized error response."""
    error_data = {
        "code": code,
        "message": message,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    if field:
        error_data["field"] = field
    
    if details:
        error_data["details"] = details
    
    return {"error": error_data}

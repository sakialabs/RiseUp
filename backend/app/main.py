"""FastAPI application entry point for RiseUp Collective."""

import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.exceptions import (
    RiseUpException,
    ValidationException,
    AuthenticationException,
    AuthorizationException,
    NotFoundException,
    ConflictException,
    ServerException,
    create_error_response
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers

@app.exception_handler(RiseUpException)
async def riseup_exception_handler(request: Request, exc: RiseUpException):
    """Handle all custom RiseUp exceptions."""
    logger.warning(
        f"RiseUp exception: {exc.code} - {exc.message}",
        extra={"path": request.url.path, "field": exc.field}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            code=exc.code,
            message=exc.message,
            field=exc.field,
            details=exc.details
        )
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle FastAPI/Pydantic validation errors (400)."""
    errors = exc.errors()
    field = None
    message = "Validation error"
    
    if errors:
        first_error = errors[0]
        field = ".".join(str(loc) for loc in first_error["loc"] if loc != "body")
        message = first_error["msg"]
    
    logger.warning(
        f"Validation error: {message}",
        extra={"path": request.url.path, "errors": errors}
    )
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=create_error_response(
            code="VALIDATION_ERROR",
            message=message,
            field=field,
            details={"errors": errors}
        )
    )


@app.exception_handler(ValidationError)
async def pydantic_validation_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors (400)."""
    errors = exc.errors()
    field = None
    message = "Validation error"
    
    if errors:
        first_error = errors[0]
        field = ".".join(str(loc) for loc in first_error["loc"])
        message = first_error["msg"]
    
    logger.warning(
        f"Pydantic validation error: {message}",
        extra={"path": request.url.path, "errors": errors}
    )
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=create_error_response(
            code="VALIDATION_ERROR",
            message=message,
            field=field,
            details={"errors": errors}
        )
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    """Handle database integrity constraint violations (409)."""
    error_message = str(exc.orig) if hasattr(exc, 'orig') else str(exc)
    
    # Parse common constraint violations
    if "unique constraint" in error_message.lower():
        message = "This resource already exists"
        code = "DUPLICATE_RESOURCE"
    elif "foreign key constraint" in error_message.lower():
        message = "Referenced resource does not exist"
        code = "INVALID_REFERENCE"
    else:
        message = "Database constraint violation"
        code = "CONSTRAINT_VIOLATION"
    
    logger.warning(
        f"Integrity error: {message}",
        extra={"path": request.url.path, "error": error_message}
    )
    
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content=create_error_response(
            code=code,
            message=message,
            details={"database_error": error_message}
        )
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    """Handle general SQLAlchemy database errors (500)."""
    error_message = str(exc)
    
    logger.error(
        f"Database error: {error_message}",
        extra={"path": request.url.path},
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=create_error_response(
            code="DATABASE_ERROR",
            message="A database error occurred. Please try again later.",
            details={}  # Don't expose internal details in production
        )
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions (500)."""
    logger.error(
        f"Unhandled exception: {type(exc).__name__} - {str(exc)}",
        extra={"path": request.url.path},
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=create_error_response(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred. Please try again later.",
            details={}
        )
    )


# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "RiseUp Collective API",
        "status": "running",
        "docs": f"{settings.API_V1_STR}/docs"
    }

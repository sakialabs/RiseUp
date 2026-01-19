"""Validation utilities for RiseUp Collective API."""

import re
from datetime import datetime
from typing import Any, List, Optional
from app.core.exceptions import ValidationException


def validate_email(email: str) -> str:
    """
    Validate email format.
    
    Args:
        email: Email address to validate
        
    Returns:
        Normalized email address (lowercase)
        
    Raises:
        ValidationException: If email format is invalid
    """
    if not email:
        raise ValidationException("Email is required", field="email")
    
    # Simple email regex pattern
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, email):
        raise ValidationException(
            "Invalid email format",
            field="email",
            details={"example": "user@example.com"}
        )
    
    return email.lower().strip()


def validate_password(password: str) -> None:
    """
    Validate password strength.
    
    Requirements:
    - At least 8 characters
    - Contains at least one letter
    - Contains at least one number
    
    Args:
        password: Password to validate
        
    Raises:
        ValidationException: If password doesn't meet requirements
    """
    if not password:
        raise ValidationException("Password is required", field="password")
    
    if len(password) < 8:
        raise ValidationException(
            "Password must be at least 8 characters long",
            field="password",
            details={"min_length": 8}
        )
    
    if not re.search(r'[A-Za-z]', password):
        raise ValidationException(
            "Password must contain at least one letter",
            field="password"
        )
    
    if not re.search(r'\d', password):
        raise ValidationException(
            "Password must contain at least one number",
            field="password"
        )


def validate_text_length(
    text: str,
    field_name: str,
    max_length: int,
    min_length: int = 0,
    required: bool = True
) -> None:
    """
    Validate text field length.
    
    Args:
        text: Text to validate
        field_name: Name of the field for error messages
        max_length: Maximum allowed length
        min_length: Minimum required length
        required: Whether the field is required
        
    Raises:
        ValidationException: If text length is invalid
    """
    if not text or not text.strip():
        if required:
            raise ValidationException(
                f"{field_name.capitalize()} is required",
                field=field_name
            )
        return
    
    text_len = len(text.strip())
    
    if text_len < min_length:
        raise ValidationException(
            f"{field_name.capitalize()} must be at least {min_length} characters",
            field=field_name,
            details={"min_length": min_length, "current_length": text_len}
        )
    
    if text_len > max_length:
        raise ValidationException(
            f"{field_name.capitalize()} exceeds maximum length of {max_length} characters",
            field=field_name,
            details={"max_length": max_length, "current_length": text_len}
        )


def validate_future_date(date: datetime, field_name: str = "date") -> None:
    """
    Validate that a date is in the future.
    
    Args:
        date: Date to validate
        field_name: Name of the field for error messages
        
    Raises:
        ValidationException: If date is in the past
    """
    if not date:
        raise ValidationException(
            f"{field_name.capitalize()} is required",
            field=field_name
        )
    
    now = datetime.utcnow()
    
    if date <= now:
        raise ValidationException(
            f"{field_name.capitalize()} cannot be in the past",
            field=field_name,
            details={
                "provided_date": date.isoformat(),
                "current_time": now.isoformat()
            }
        )


def validate_coordinates(
    latitude: Optional[float],
    longitude: Optional[float]
) -> None:
    """
    Validate geographic coordinates.
    
    Both must be provided together or both must be None.
    Latitude must be between -90 and 90.
    Longitude must be between -180 and 180.
    
    Args:
        latitude: Latitude coordinate
        longitude: Longitude coordinate
        
    Raises:
        ValidationException: If coordinates are invalid
    """
    # If one is provided, both must be provided
    if (latitude is None) != (longitude is None):
        raise ValidationException(
            "Both latitude and longitude must be provided together",
            field="coordinates",
            details={"latitude": latitude, "longitude": longitude}
        )
    
    # If both are None, that's valid (optional coordinates)
    if latitude is None and longitude is None:
        return
    
    # Validate latitude range
    if not -90 <= latitude <= 90:
        raise ValidationException(
            "Latitude must be between -90 and 90",
            field="latitude",
            details={"value": latitude, "range": [-90, 90]}
        )
    
    # Validate longitude range
    if not -180 <= longitude <= 180:
        raise ValidationException(
            "Longitude must be between -180 and 180",
            field="longitude",
            details={"value": longitude, "range": [-180, 180]}
        )


def validate_enum(
    value: str,
    allowed_values: List[str],
    field_name: str
) -> None:
    """
    Validate that a value is in an allowed set.
    
    Args:
        value: Value to validate
        allowed_values: List of allowed values
        field_name: Name of the field for error messages
        
    Raises:
        ValidationException: If value is not in allowed set
    """
    if not value:
        raise ValidationException(
            f"{field_name.capitalize()} is required",
            field=field_name
        )
    
    if value not in allowed_values:
        raise ValidationException(
            f"Invalid {field_name}. Must be one of: {', '.join(allowed_values)}",
            field=field_name,
            details={"provided": value, "allowed": allowed_values}
        )


def validate_reaction_type(reaction_type: str) -> None:
    """
    Validate reaction type.
    
    Args:
        reaction_type: Reaction type to validate
        
    Raises:
        ValidationException: If reaction type is invalid
    """
    allowed_types = ['care', 'solidarity', 'respect', 'gratitude']
    validate_enum(reaction_type, allowed_types, "reaction_type")


def validate_target_type(target_type: str) -> None:
    """
    Validate target type for reactions.
    
    Args:
        target_type: Target type to validate
        
    Raises:
        ValidationException: If target type is invalid
    """
    allowed_types = ['event', 'post']
    validate_enum(target_type, allowed_types, "target_type")


def validate_profile_type(profile_type: str) -> None:
    """
    Validate profile type.
    
    Args:
        profile_type: Profile type to validate
        
    Raises:
        ValidationException: If profile type is invalid
    """
    allowed_types = ['individual', 'group']
    validate_enum(profile_type, allowed_types, "profile_type")

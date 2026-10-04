from pydantic import BaseModel, EmailStr, Field
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserOut
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["User Profile"])

class UserProfileUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

@router.get("/profile", response_model=UserOut, summary="Get User Profile")
def get_profile(current_user: User = Depends(get_current_user)):
    """Returns profile details of authenticated user."""
    return current_user

@router.put("/profile", response_model=UserOut, summary="Update User Profile")
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates display name of authenticated user."""
    current_user.name = profile_data.name
    db.commit()
    db.refresh(current_user)
    return current_user

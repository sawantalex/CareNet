from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserCreate, UserLogin, UserOut, Token
from app.services.auth_service import register_user, authenticate_user
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED, summary="User Registration")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registers a new user account with hashed password storage."""
    return register_user(db, user_data)

@router.post("/login", response_model=Token, summary="User Login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user and returns JWT Bearer access token."""
    access_token = authenticate_user(db, login_data)
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserOut, summary="Get Current User Profile")
def get_me(current_user: User = Depends(get_current_user)):
    """Returns profile details of currently authenticated user."""
    return current_user

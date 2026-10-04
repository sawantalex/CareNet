from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.heart import HeartPredictionRequest, HeartPredictionResponse
from app.services.heart_service import process_heart_prediction
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/heart", tags=["Heart Disease Risk"])

@router.post("/predict", response_model=HeartPredictionResponse, status_code=status.HTTP_200_OK, summary="Predict Heart Disease Risk")
def predict_heart(
    request_data: HeartPredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validates input features, executes prediction via heart_disease_model.pkl, and saves prediction history.
    """
    return process_heart_prediction(db, current_user, request_data)

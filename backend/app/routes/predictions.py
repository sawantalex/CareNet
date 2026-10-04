from typing import Optional
from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.prediction import PredictionHistoryResponse, PredictionOut
from app.services.prediction_service import get_user_predictions, get_prediction_by_id
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/predictions", tags=["Prediction History"])

@router.get("/history", response_model=PredictionHistoryResponse, summary="Get Prediction History")
def get_history(
    module: Optional[str] = Query(None, description="Filter by module: 'heart_disease' or 'medical_diagnostics'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns prediction history belonging only to the authenticated user.
    """
    return get_user_predictions(db, current_user, module=module, page=page, limit=limit)

@router.get("/{prediction_id}", response_model=PredictionOut, summary="Get Specific Prediction Detail")
def get_prediction_detail(
    prediction_id: int = Path(..., ge=1, description="Prediction ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns detailed prediction record by ID for current user.
    """
    return get_prediction_by_id(db, current_user, prediction_id)

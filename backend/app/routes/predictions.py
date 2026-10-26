from typing import Optional
from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.prediction import PredictionHistoryResponse, PredictionOut
from app.services.prediction_service import get_user_predictions, get_prediction_by_id

router = APIRouter(prefix="/predictions", tags=["Prediction History"])

@router.get("/history", response_model=PredictionHistoryResponse, summary="Get Prediction History")
def get_history(
    name: Optional[str] = Query(None, description="Filter by patient / user name"),
    module: Optional[str] = Query(None, description="Filter by module: 'heart_disease' or 'medical_diagnostics'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Returns prediction history, optionally filtered by patient/user name and module.
    """
    return get_user_predictions(db, user_name=name, module=module, page=page, limit=limit)

@router.get("/{prediction_id}", response_model=PredictionOut, summary="Get Specific Prediction Detail")
def get_prediction_detail(
    prediction_id: int = Path(..., ge=1, description="Prediction ID"),
    db: Session = Depends(get_db)
):
    """
    Returns detailed prediction record by ID.
    """
    return get_prediction_by_id(db, prediction_id)

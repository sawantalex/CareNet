from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.medical import MedicalPredictionRequest, MedicalPredictionResponse
from app.services.medical_service import process_medical_prediction

router = APIRouter(prefix="/medical", tags=["Medical Diagnostics"])

@router.post("/predict", response_model=MedicalPredictionResponse, status_code=status.HTTP_200_OK, summary="Predict Medical Diagnostics from Symptoms")
def predict_medical(
    request_data: MedicalPredictionRequest,
    db: Session = Depends(get_db)
):
    """
    Validates symptom description, executes text classification via medical_diagnosis_model.pkl, and saves prediction history under user's name.
    """
    return process_medical_prediction(db, request_data)

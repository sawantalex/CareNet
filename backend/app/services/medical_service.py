import json
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.schemas.medical import MedicalPredictionRequest, MedicalPredictionResponse
from app.ml.medical_predictor import predict_medical_symptoms
from app.services.prediction_service import get_or_create_user_by_name

def process_medical_prediction(db: Session, request_data: MedicalPredictionRequest) -> MedicalPredictionResponse:
    res = predict_medical_symptoms(request_data)
    
    # Resolve user by name (preserves prediction history)
    user = get_or_create_user_by_name(db, request_data.user_name)

    # Persist prediction in database
    input_json = json.dumps({"symptoms": res["symptoms"]})
    db_pred = Prediction(
        user_id=user.id,
        module="medical_diagnostics",
        input_data=input_json,
        prediction=res["prediction"],
        confidence=res["confidence"]
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)

    return MedicalPredictionResponse(
        success=True,
        module="medical_diagnostics",
        prediction=res["prediction"],
        confidence=res["confidence"]
    )

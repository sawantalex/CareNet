import json
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.medical import MedicalPredictionRequest, MedicalPredictionResponse
from app.ml.medical_predictor import predict_medical_symptoms

def process_medical_prediction(db: Session, current_user: User, request_data: MedicalPredictionRequest) -> MedicalPredictionResponse:
    res = predict_medical_symptoms(request_data)
    
    # Persist prediction in database
    input_json = json.dumps({"symptoms": res["symptoms"]})
    db_pred = Prediction(
        user_id=current_user.id,
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

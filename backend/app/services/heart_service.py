import json
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.schemas.heart import HeartPredictionRequest, HeartPredictionResponse
from app.ml.heart_predictor import predict_heart_disease
from app.services.prediction_service import get_or_create_user_by_name

def process_heart_prediction(db: Session, request_data: HeartPredictionRequest) -> HeartPredictionResponse:
    res = predict_heart_disease(request_data)
    
    # Resolve user by name (preserves prediction history)
    user = get_or_create_user_by_name(db, request_data.user_name)

    # Persist prediction in database
    input_json = json.dumps(res["input_dict"])
    db_pred = Prediction(
        user_id=user.id,
        module="heart_disease",
        input_data=input_json,
        prediction=res["prediction"],
        confidence=res["confidence"]
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)

    return HeartPredictionResponse(
        success=True,
        module="heart_disease",
        prediction=res["prediction"],
        risk_level=res["risk_level"],
        confidence=res["confidence"],
        message=res["message"]
    )

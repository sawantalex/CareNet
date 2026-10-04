import json
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.heart import HeartPredictionRequest, HeartPredictionResponse
from app.ml.heart_predictor import predict_heart_disease

def process_heart_prediction(db: Session, current_user: User, request_data: HeartPredictionRequest) -> HeartPredictionResponse:
    res = predict_heart_disease(request_data)
    
    # Persist prediction in database
    input_json = json.dumps(res["input_dict"])
    db_pred = Prediction(
        user_id=current_user.id,
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

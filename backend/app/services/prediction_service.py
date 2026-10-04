import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionOut, PredictionHistoryResponse

def get_user_predictions(
    db: Session,
    current_user: User,
    module: Optional[str] = None,
    page: int = 1,
    limit: int = 20
) -> PredictionHistoryResponse:
    query = db.query(Prediction).filter(Prediction.user_id == current_user.id)
    
    if module and module != "all":
        query = query.filter(Prediction.module == module)
        
    total = query.count()
    offset = (page - 1) * limit
    db_predictions = query.order_by(Prediction.created_at.desc()).offset(offset).limit(limit).all()

    out_list = []
    for p in db_predictions:
        try:
            parsed_input = json.loads(p.input_data)
        except Exception:
            parsed_input = {"raw": p.input_data}

        out_list.append(PredictionOut(
            id=p.id,
            user_id=p.user_id,
            module=p.module,
            input_data=parsed_input,
            prediction=p.prediction,
            confidence=p.confidence,
            created_at=p.created_at
        ))

    return PredictionHistoryResponse(
        total=total,
        page=page,
        limit=limit,
        predictions=out_list
    )

def get_prediction_by_id(db: Session, current_user: User, prediction_id: int) -> PredictionOut:
    p = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()

    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )

    try:
        parsed_input = json.loads(p.input_data)
    except Exception:
        parsed_input = {"raw": p.input_data}

    return PredictionOut(
        id=p.id,
        user_id=p.user_id,
        module=p.module,
        input_data=parsed_input,
        prediction=p.prediction,
        confidence=p.confidence,
        created_at=p.created_at
    )

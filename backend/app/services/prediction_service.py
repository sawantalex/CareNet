import json
import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionOut, PredictionHistoryResponse

def get_or_create_user_by_name(db: Session, user_name: Optional[str]) -> User:
    """
    Finds an existing user by name (case-insensitive) or registers a new user with that name.
    Preserves prediction history under the provided name without requiring login or email.
    """
    name = (user_name or "").strip()
    if not name:
        name = "Guest User"

    # Search for user by case-insensitive name
    existing_user = db.query(User).filter(User.name.ilike(name)).first()
    if existing_user:
        return existing_user

    # Create new user record
    safe_slug = "".join(c for c in name.lower() if c.isalnum() or c in "_-")[:25] or "guest"
    unique_suffix = uuid.uuid4().hex[:8]
    email = f"{safe_slug}_{unique_suffix}@carenet.local"

    new_user = User(
        name=name,
        email=email,
        password_hash="guest_no_auth"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_predictions(
    db: Session,
    user_name: Optional[str] = None,
    module: Optional[str] = None,
    page: int = 1,
    limit: int = 20
) -> PredictionHistoryResponse:
    query = db.query(Prediction, User.name.label("user_name")).outerjoin(User, Prediction.user_id == User.id)
    
    if user_name and user_name.strip():
        query = query.filter(User.name.ilike(f"%{user_name.strip()}%"))

    if module and module != "all":
        query = query.filter(Prediction.module == module)
        
    total = query.count()
    offset = (page - 1) * limit
    db_predictions = query.order_by(Prediction.created_at.desc()).offset(offset).limit(limit).all()

    out_list = []
    for p, uname in db_predictions:
        try:
            parsed_input = json.loads(p.input_data)
        except Exception:
            parsed_input = {"raw": p.input_data}

        out_list.append(PredictionOut(
            id=p.id,
            user_id=p.user_id,
            user_name=uname or "Guest",
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

def get_prediction_by_id(db: Session, prediction_id: int) -> PredictionOut:
    result = db.query(Prediction, User.name.label("user_name")).outerjoin(
        User, Prediction.user_id == User.id
    ).filter(Prediction.id == prediction_id).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )

    p, uname = result
    try:
        parsed_input = json.loads(p.input_data)
    except Exception:
        parsed_input = {"raw": p.input_data}

    return PredictionOut(
        id=p.id,
        user_id=p.user_id,
        user_name=uname or "Guest",
        module=p.module,
        input_data=parsed_input,
        prediction=p.prediction,
        confidence=p.confidence,
        created_at=p.created_at
    )


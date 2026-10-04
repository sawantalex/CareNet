import datetime
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class PredictionOut(BaseModel):
    id: int
    user_id: int
    module: str
    input_data: Dict[str, Any]
    prediction: str
    confidence: Optional[float] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class PredictionHistoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    predictions: List[PredictionOut]

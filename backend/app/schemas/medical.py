from pydantic import BaseModel, Field
from typing import Optional

class MedicalPredictionRequest(BaseModel):
    symptoms: str = Field(..., min_length=3, max_length=2000, example="I have high fever, headache, cough and sore throat")

class MedicalPredictionResponse(BaseModel):
    success: bool = True
    module: str = "medical_diagnostics"
    prediction: str
    confidence: Optional[float] = None
    disclaimer: str = "CareNet provides AI-based predictions for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment."

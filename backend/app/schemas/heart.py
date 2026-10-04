from pydantic import BaseModel, Field
from typing import Optional

class HeartPredictionRequest(BaseModel):
    Age: int = Field(..., ge=1, le=120, example=45)
    Gender: str = Field(..., example="Male")  # Male, Female
    Blood_Pressure: float = Field(..., alias="Blood Pressure", ge=60, le=240, example=120.0)
    Cholesterol_Level: float = Field(..., alias="Cholesterol Level", ge=100, le=500, example=200.0)
    BMI: float = Field(..., ge=10.0, le=60.0, example=24.5)
    Sleep_Hours: float = Field(..., alias="Sleep Hours", ge=1.0, le=16.0, example=7.5)
    Triglyceride_Level: float = Field(..., alias="Triglyceride Level", ge=50, le=1000, example=150.0)
    Fasting_Blood_Sugar: float = Field(..., alias="Fasting Blood Sugar", ge=50, le=400, example=95.0)
    CRP_Level: float = Field(..., alias="CRP Level", ge=0.0, le=50.0, example=1.2)
    Homocysteine_Level: float = Field(..., alias="Homocysteine Level", ge=0.0, le=100.0, example=10.0)
    Exercise_Habits: str = Field(..., alias="Exercise Habits", example="Medium")  # Low, Medium, High
    Smoking: str = Field(..., example="No")  # Yes, No
    Family_Heart_Disease: str = Field(..., alias="Family Heart Disease", example="No")  # Yes, No
    Diabetes: str = Field(..., example="No")  # Yes, No
    High_Blood_Pressure: str = Field(..., alias="High Blood Pressure", example="No")  # Yes, No
    Low_HDL_Cholesterol: str = Field(..., alias="Low HDL Cholesterol", example="No")  # Yes, No
    High_LDL_Cholesterol: str = Field(..., alias="High LDL Cholesterol", example="No")  # Yes, No
    Alcohol_Consumption: str = Field(..., alias="Alcohol Consumption", example="Low")  # Low, Medium, High
    Stress_Level: str = Field(..., alias="Stress Level", example="Medium")  # Low, Medium, High
    Sugar_Consumption: str = Field(..., alias="Sugar Consumption", example="Medium")  # Low, Medium, High

    class Config:
        populate_by_name = True

class HeartPredictionResponse(BaseModel):
    success: bool = True
    module: str = "heart_disease"
    prediction: str
    risk_level: str
    confidence: Optional[float] = None
    message: str
    disclaimer: str = "CareNet provides AI-based predictions for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment."

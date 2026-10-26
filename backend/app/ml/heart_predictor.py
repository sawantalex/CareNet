import logging
import pandas as pd
from app.ml.model_loader import model_manager
from app.schemas.heart import HeartPredictionRequest

logger = logging.getLogger("carenet.ml.heart")

def predict_heart_disease(request_data: HeartPredictionRequest):
    """
    Executes prediction using the loaded heart_disease_model.pkl pipeline.
    """
    if not model_manager.loaded or model_manager.heart_model is None:
        model_manager.load_models()

    input_dict = {
        'Age': [request_data.Age],
        'Gender': [request_data.Gender],
        'Blood Pressure': [request_data.Blood_Pressure],
        'Cholesterol Level': [request_data.Cholesterol_Level],
        'BMI': [request_data.BMI],
        'Sleep Hours': [request_data.Sleep_Hours],
        'Triglyceride Level': [request_data.Triglyceride_Level],
        'Fasting Blood Sugar': [request_data.Fasting_Blood_Sugar],
        'CRP Level': [request_data.CRP_Level],
        'Homocysteine Level': [request_data.Homocysteine_Level],
        'Exercise Habits': [request_data.Exercise_Habits],
        'Smoking': [request_data.Smoking],
        'Family Heart Disease': [request_data.Family_Heart_Disease],
        'Diabetes': [request_data.Diabetes],
        'High Blood Pressure': [request_data.High_Blood_Pressure],
        'Low HDL Cholesterol': [request_data.Low_HDL_Cholesterol],
        'High LDL Cholesterol': [request_data.High_LDL_Cholesterol],
        'Alcohol Consumption': [request_data.Alcohol_Consumption],
        'Stress Level': [request_data.Stress_Level],
        'Sugar Consumption': [request_data.Sugar_Consumption]
    }

    df = pd.DataFrame(input_dict)
    
    try:
        raw_pred = model_manager.heart_model.predict(df)[0]
        
        confidence = None
        if hasattr(model_manager.heart_model, "predict_proba"):
            proba = model_manager.heart_model.predict_proba(df)[0]
            # Assuming binary classification where index 1 corresponds to positive risk (Yes/1)
            confidence = float(max(proba))
            risk_prob = float(proba[1]) if len(proba) > 1 else float(proba[0])
        else:
            risk_prob = 0.5

        # Risk level interpretation, prediction title, and clinical guidance
        if risk_prob >= 0.60 or (raw_pred in [1, "1", "Yes", "High"] and risk_prob >= 0.50):
            risk_level = "High"
            prediction_str = "High Risk of Heart Disease"
            msg = "The model indicates an elevated cardiovascular risk profile based on your biomarkers and health metrics. Consulting a healthcare professional is strongly recommended."
        elif risk_prob >= 0.30:
            risk_level = "Moderate"
            prediction_str = "Moderate Risk of Heart Disease"
            msg = "The model indicates a moderate heart disease risk. Lifestyle adjustments and regular clinical monitoring are recommended."
        else:
            risk_level = "Low"
            prediction_str = "Low Risk of Heart Disease"
            msg = "The model indicates a low heart disease risk profile based on your current metrics."

        return {
            "prediction": prediction_str,
            "raw_pred": str(raw_pred),
            "risk_level": risk_level,
            "confidence": round(confidence, 4) if confidence is not None else None,
            "message": msg,
            "input_dict": {k: v[0] for k, v in input_dict.items()}
        }

    except Exception as e:
        logger.error(f"Error during heart disease prediction: {e}")
        raise RuntimeError(f"Heart disease prediction error: {str(e)}")

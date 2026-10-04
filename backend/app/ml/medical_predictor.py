import logging
import pandas as pd
from app.ml.model_loader import model_manager
from app.schemas.medical import MedicalPredictionRequest

logger = logging.getLogger("carenet.ml.medical")

def predict_medical_symptoms(request_data: MedicalPredictionRequest):
    """
    Executes symptom diagnosis prediction using the loaded medical_diagnosis_model.pkl pipeline.
    """
    if not model_manager.loaded or model_manager.medical_model is None:
        model_manager.load_models()

    symptoms_text = request_data.symptoms.strip()
    symptoms_series = pd.Series([symptoms_text])

    try:
        raw_pred = model_manager.medical_model.predict(symptoms_series)[0]

        # Format condition text for display (capitalized title)
        predicted_condition = str(raw_pred).replace("_", " ").title()

        return {
            "prediction": predicted_condition,
            "raw_pred": str(raw_pred),
            "confidence": None,  # LinearSVC does not support predict_proba
            "symptoms": symptoms_text
        }

    except Exception as e:
        logger.error(f"Error during medical symptoms prediction: {e}")
        raise RuntimeError(f"Medical symptoms prediction error: {str(e)}")

from fastapi import APIRouter, status
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("/assistant", response_model=ChatResponse, status_code=status.HTTP_200_OK, summary="CareNet AI Healthcare Assistant Chat")
def chat_assistant(request: ChatRequest):
    """
    Intelligent Healthcare Assistant endpoint providing answers regarding CareNet AI models,
    biometrics, NLP symptom diagnostics, and health recommendations.
    """
    query = request.message.lower().strip()

    if any(k in query for k in ["heart", "cardio", "bp", "cholesterol", "pulse", "st depression"]):
        reply = (
            "CareNet's Heart AI Module evaluates 20 clinical metrics—including Resting Blood Pressure, "
            "Serum Cholesterol, Max Heart Rate, ST Depression (Oldpeak), Thalassemia, and Vessel Fluoroscopy. "
            "It uses a pre-trained Support Vector Classifier (SVC) pipeline to assess cardiovascular risk."
        )
        suggestions = ["What are optimal cholesterol levels?", "How to lower resting blood pressure?", "Run Heart Assessment"]

    elif any(k in query for k in ["symptom", "diagnos", "fever", "cough", "flu", "cold", "nlp"]):
        reply = (
            "CareNet's Medical Diagnostic Module analyzes free-text symptom descriptions across 22 conditions "
            "using TF-IDF n-gram feature extraction and Linear Support Vector Classification. "
            "For example, entering 'high fever, chills, body pain and headache' yields a classification match."
        )
        suggestions = ["Diagnose Flu & Fever", "Which conditions can CareNet identify?", "Emergency Precautions"]

    elif any(k in query for k in ["emergency", "urgent", "chest pain", "breathless", "ambulance", "911", "102", "108"]):
        reply = (
            "⚠️ CRITICAL EMERGENCY NOTICE: If you or someone around you is experiencing severe chest pain, "
            "shortness of breath, sudden numbness, or loss of consciousness, please call emergency services immediately (108 / 112 / 911) "
            "or seek immediate emergency medical care."
        )
        suggestions = ["Emergency Contact Lines", "Heart Attack Warning Signs", "First Aid Guidance"]

    elif any(k in query for k in ["who are you", "what is carenet", "about", "help", "hello", "hi"]):
        reply = (
            "Hello! I am the CareNet AI Healthcare Assistant. I can help answer questions about your heart risk assessments, "
            "explain clinical biometric parameters, detail symptom diagnostic classifications, and provide general health guidance."
        )
        suggestions = ["Explain Heart Risk Factors", "How does Symptom NLP work?", "View Assessment History"]

    else:
        reply = (
            f"Thank you for your question about '{request.message}'. CareNet AI specializes in cardiovascular risk prediction "
            "and NLP symptom diagnostic classification. For specific clinical symptoms or personalized medical advice, "
            "always consult a certified physician."
        )
        suggestions = ["Explain Heart AI Metrics", "Diagnose Symptoms", "General Health Tips"]

    return ChatResponse(reply=reply, suggestions=suggestions)

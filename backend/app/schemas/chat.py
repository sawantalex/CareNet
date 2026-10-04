from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., example="user")
    content: str = Field(..., example="What are the main risk factors for heart disease?")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, example="How does CareNet diagnose symptom patterns?")
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    suggestions: Optional[List[str]] = [
        "What clinical metrics are used for heart risk?",
        "How accurately does NLP classify symptoms?",
        "What should I do in a medical emergency?"
    ]
    disclaimer: str = "CareNet AI Assistant provides information for educational purposes only and does not replace medical advice."

from app.routes.auth import router as auth_router
from app.routes.heart import router as heart_router
from app.routes.medical import router as medical_router
from app.routes.predictions import router as predictions_router
from app.routes.users import router as users_router

__all__ = [
    "auth_router",
    "heart_router",
    "medical_router",
    "predictions_router",
    "users_router"
]

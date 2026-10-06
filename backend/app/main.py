import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.ml.model_loader import model_manager
from app.routes.auth import router as auth_router
from app.routes.heart import router as heart_router
from app.routes.medical import router as medical_router
from app.routes.predictions import router as predictions_router
from app.routes.users import router as users_router
from app.routes.chat import router as chat_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("carenet.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("Initializing CareNet Backend...")
    # Initialize database tables
    try:
        init_db()
        logger.info("Database initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

    # Load ML models
    try:
        model_manager.load_models()
        logger.info("ML models loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load ML models: {e}")

    yield
    logger.info("CareNet Backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS (allow all origins for production Vercel & local development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(heart_router, prefix=settings.API_V1_STR)
app.include_router(medical_router, prefix=settings.API_V1_STR)
app.include_router(predictions_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """Health check endpoint confirming API operational status."""
    return {
        "status": "ok",
        "service": "CareNet API",
        "models_loaded": model_manager.loaded
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

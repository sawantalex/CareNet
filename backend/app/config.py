import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

def _get_sqlite_fallback() -> str:
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME") or os.getenv("AWS_EXECUTION_ENV"):
        return "sqlite:////tmp/carenet.db"
    return os.getenv("SQLITE_FALLBACK_URL", "sqlite:///./carenet.db")

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareNet AI Health Risk & Medical Diagnostics Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "carenet_default_super_secret_key_1234567890")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/carenet_db")
    SQLITE_FALLBACK_URL: str = _get_sqlite_fallback()
    
def _find_model_path(filename: str) -> Path:
    candidates = [
        BASE_DIR.parent / "models" / filename,
        BASE_DIR / "models" / filename,
        Path.cwd() / "models" / filename,
        Path.cwd() / "backend" / "models" / filename,
        Path("/var/task/models") / filename,
        Path("/var/task/backend/models") / filename,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareNet AI Health Risk & Medical Diagnostics Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "carenet_default_super_secret_key_1234567890")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/carenet_db")
    SQLITE_FALLBACK_URL: str = _get_sqlite_fallback()
    
    # Model paths
    HEART_MODEL_PATH: Path = _find_model_path("heart_disease_model.pkl")
    MEDICAL_MODEL_PATH: Path = _find_model_path("medical_diagnosis_model.pkl")

    class Config:
        env_file = str(BASE_DIR / ".env")
        extra = "ignore"

settings = Settings()

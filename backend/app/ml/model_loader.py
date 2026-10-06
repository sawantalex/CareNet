import logging
import joblib
import sklearn.compose._column_transformer as ct
import sklearn.impute._base as impute_base
from app.config import settings

logger = logging.getLogger("carenet.ml")

# --- Scikit-Learn Version Compatibility Layer ---
if not hasattr(ct, '_RemainderColsList'):
    class _RemainderColsList(list):
        pass
    ct._RemainderColsList = _RemainderColsList

_original_imputer_transform = impute_base.SimpleImputer.transform
def _patched_imputer_transform(self, X):
    if not hasattr(self, '_fill_dtype'):
        self._fill_dtype = getattr(self, 'statistics_', None).dtype if hasattr(self, 'statistics_') else None
    return _original_imputer_transform(self, X)
impute_base.SimpleImputer.transform = _patched_imputer_transform
# ------------------------------------------------

class ModelManager:
    _instance = None

    def __init__(self):
        self.heart_model = None
        self.medical_model = None
        self.loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def load_models(self):
        if self.loaded:
            return

        logger.info("Loading ML models...")
        
        # Load Heart Disease Model
        if settings.HEART_MODEL_PATH.exists():
            try:
                self.heart_model = joblib.load(settings.HEART_MODEL_PATH)
                logger.info("Heart disease ML model loaded successfully.")
            except Exception as e:
                logger.warning(f"Failed to load Heart disease ML model: {e}")
        else:
            logger.warning(f"Heart model PKL file not found at: {settings.HEART_MODEL_PATH}")

        # Load Medical Diagnosis Model
        if settings.MEDICAL_MODEL_PATH.exists():
            try:
                self.medical_model = joblib.load(settings.MEDICAL_MODEL_PATH)
                logger.info("Medical diagnosis ML model loaded successfully.")
            except Exception as e:
                logger.warning(f"Failed to load Medical diagnosis ML model: {e}")
        else:
            logger.warning(f"Medical diagnosis model PKL file not found at: {settings.MEDICAL_MODEL_PATH}")

        self.loaded = (self.heart_model is not None or self.medical_model is not None)

model_manager = ModelManager.get_instance()

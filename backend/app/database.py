import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("carenet.database")

# Base class for SQLAlchemy ORM models
Base = declarative_base()

def get_engine():
    """
    Attempts to connect to MySQL.
    If MySQL server or database is not reachable, creates/uses SQLite database as fallback.
    """
    try:
        # First attempt MySQL
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Successfully connected to MySQL database.")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to MySQL database at {settings.DATABASE_URL}: {e}")
        logger.info(f"Falling back to local SQLite database: {settings.SQLITE_FALLBACK_URL}")
        fallback_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return fallback_engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models import user, prediction
    Base.metadata.create_all(bind=engine)

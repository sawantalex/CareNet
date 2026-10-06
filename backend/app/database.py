import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("carenet.database")

# Base class for SQLAlchemy ORM models
Base = declarative_base()

def _create_tables(engine_obj):
    try:
        from app.models import user, prediction
        Base.metadata.create_all(bind=engine_obj)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

def get_engine():
    """
    Attempts to connect to MySQL if configured and reachable.
    Otherwise falls back to SQLite database (/tmp/carenet.db on Vercel).
    """
    db_url = settings.DATABASE_URL
    if db_url and not db_url.startswith("mysql+pymysql://root:@localhost"):
        try:
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600
            )
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to primary database.")
            _create_tables(engine)
            return engine
        except Exception as e:
            logger.warning(f"Could not connect to primary database at {db_url}: {e}")

    fallback_url = settings.SQLITE_FALLBACK_URL
    logger.info(f"Using SQLite database: {fallback_url}")
    fallback_engine = create_engine(
        fallback_url,
        connect_args={"check_same_thread": False}
    )
    _create_tables(fallback_engine)
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
    _create_tables(engine)

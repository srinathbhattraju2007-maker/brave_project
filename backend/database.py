import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

# Retrieve DATABASE_URL or use a default PostgreSQL config
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nagapavan_db")

try:
    # Attempt to connect to the configured PostgreSQL instance
    if DATABASE_URL.startswith("postgresql"):
        # pool_pre_ping checks if the connection is alive before using it
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Test the connection immediately
        with engine.connect() as conn:
            pass
        print("Connected to PostgreSQL successfully.")
    else:
        raise ValueError("Not a PostgreSQL URL, falling back.")
except Exception as e:
    print(f"Could not connect to PostgreSQL: {e}")
    print("Falling back to SQLite for local development: sqlite:///./nagapavan.db")
    DATABASE_URL = "sqlite:///./nagapavan.db"
    # sqlite database creation & check_same_thread configuration
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get db session in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

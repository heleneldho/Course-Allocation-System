import os
from sqlmodel import create_engine

# Read from cloud environment variable; fallback to local SQLite file if missing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local_database.db")

# Neon requires sslmode, SQLite does not. This check prevents configuration errors.
if "postgresql" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
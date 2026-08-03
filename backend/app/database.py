"""
Configuration de la base de données pour l'authentification.

SQLite en fichier local -- zéro configuration serveur, largement suffisant pour
le hackathon. Migration vers Postgres possible plus tard (SQLAlchemy rend ça
indolore : il suffit de changer DATABASE_URL, le reste du code ne change pas).
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./lexbenin.db")

# check_same_thread=False nécessaire pour SQLite avec FastAPI (requêtes multi-thread)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency FastAPI : fournit une session DB par requête, la ferme après."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

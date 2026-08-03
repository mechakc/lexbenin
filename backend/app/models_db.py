"""
Modèle SQLAlchemy pour les comptes utilisateurs.

Un seul modèle User couvre les deux types de compte (individu / institution) --
les champs propres à l'institution restent NULL pour un compte individu, et
inversement. Plus simple à gérer qu'une table séparée pour un MVP, quitte à
splitter proprement plus tard si le volet B2B (cf. roadmap durabilité) se
développe vraiment.
"""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Enum, Integer
from app.database import Base


class TypeCompte(str, enum.Enum):
    individu = "individu"
    institution = "institution"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    type_compte = Column(Enum(TypeCompte), nullable=False)

    # Champs individu
    nom = Column(String, nullable=True)
    prenom = Column(String, nullable=True)

    # Champs institution
    nom_institution = Column(String, nullable=True)
    secteur_activite = Column(String, nullable=True)
    nombre_employes = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

"""
Authentification : hashing bcrypt des mots de passe + tokens JWT pour les sessions.

JWT plutôt que des sessions serveur classiques : pas d'état à stocker côté
serveur (le token contient tout), ce qui simplifie le déploiement (pas besoin
de sticky sessions ou de store partagé si un jour il y a plusieurs instances
de l'API derrière un load balancer).

IMPORTANT SÉCURITÉ : AUTH_SECRET_KEY doit être une vraie valeur secrète et
aléatoire en production, définie via variable d'environnement -- jamais
committée dans le code. La valeur par défaut ci-dessous n'est là que pour que
le développement local fonctionne sans configuration ; ne JAMAIS déployer
avec cette valeur par défaut.
"""

import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models_db import User

SECRET_KEY = os.environ.get("AUTH_SECRET_KEY", "dev-only-secret-change-me-before-deploying")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 jours

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    # bcrypt tronque de toute façon au-delà de 72 octets -- on le fait explicitement
    # pour éviter tout comportement surprenant sur des mots de passe très longs.
    password_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    password_bytes = password.encode("utf-8")[:72]
    return bcrypt.checkpw(password_bytes, password_hash.encode("utf-8"))


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """Retourne l'user_id contenu dans le token, ou None si invalide/expiré."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Dependency FastAPI : exige un token valide, lève 401 sinon.
    À utiliser sur les routes qui nécessitent obligatoirement d'être connecté."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Non authentifié.")
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide ou expiré.")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable.")
    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """Comme get_current_user, mais retourne None au lieu de lever une erreur si
    pas de token -- pour les routes utilisables avec OU sans compte (ex: /ask)."""
    if credentials is None:
        return None
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        return None
    return db.query(User).filter(User.id == user_id).first()

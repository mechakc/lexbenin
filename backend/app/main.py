"""
API FastAPI — expose le pipeline RAG complet (rag/ask.py) au frontend.

Variables d'environnement (avec défauts adaptés à ce sandbox de test) :
- EMBEDDING_BACKEND : "tfidf" (défaut, local/test) ou "e5" (production, nécessite
  sentence-transformers + accès réseau à Hugging Face)
- LLM_BACKEND : "mock" (défaut, aucun appel réseau) ou "mistral" (production,
  nécessite MISTRAL_API_KEY)

En production (ton hébergement Render/Railway/HF Spaces), il suffira de définir :
    EMBEDDING_BACKEND=e5
    LLM_BACKEND=mistral
    MISTRAL_API_KEY=ta_clé
"""

import os
import sys
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr, model_validator
from sqlalchemy.orm import Session

from rag.pipeline import build_index
from rag.llm import get_generator
from rag.ask import ask as rag_ask
from app.database import Base, engine, get_db
from app.models_db import User, TypeCompte
from app.auth import hash_password, verify_password, create_access_token, get_current_user


# Registre des pays/domaines disponibles -- source de vérité pour le frontend
# (sélecteur de pays) et pour la validation des requêtes entrantes.
PAYS_DISPONIBLES = {
    "benin": {
        "label": "Bénin",
        "domaine": "droit_numerique",
        "domaine_label": "Droit numérique",
        "statut": "verifie",  # cf. cahier des charges section 2, indicateur nice-to-have
    },
    "france": {
        "label": "France",
        "domaine": "fiscalite_ir",
        "domaine_label": "Fiscalité des particuliers (impôt sur le revenu)",
        "statut": "verifie",
    },
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Construit l'index RAG une seule fois au démarrage du serveur (pas à
    chaque requête -- l'embedder TF-IDF doit être fit, e5 doit charger le
    modèle en mémoire, les deux sont coûteux à refaire à chaque appel)."""
    embedding_backend = os.environ.get("EMBEDDING_BACKEND", "tfidf")
    llm_backend = os.environ.get("LLM_BACKEND", "mock")
    distance_threshold = os.environ.get("DISTANCE_THRESHOLD")
    app.state.distance_threshold = float(distance_threshold) if distance_threshold else None
    verify_answers = os.environ.get("VERIFY_ANSWERS", "false").lower() == "true"

    # Création des tables de la base de données (utilisateurs) si elles n'existent pas déjà
    Base.metadata.create_all(bind=engine)

    print(f"Démarrage : embedding_backend={embedding_backend}, llm_backend={llm_backend}, "
          f"distance_threshold={app.state.distance_threshold}, verify_answers={verify_answers}")
    client, embedders, lexical_indexes = build_index(backend=embedding_backend)
    generator = get_generator(llm_backend)

    app.state.client = client
    app.state.embedders = embedders
    app.state.lexical_indexes = lexical_indexes
    app.state.generator = generator

    yield  # l'app tourne ici

    print("Arrêt du serveur.")


app = FastAPI(title="LexBénin API", lifespan=lifespan)

# En dev, on autorise tout ; à restreindre à l'URL du frontend déployé en prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    pays: str = Field(..., description="Code pays, ex: 'benin' ou 'france'")
    question: str = Field(..., min_length=3, max_length=1000)
    top_k: int = Field(default=5, ge=1, le=10)


class SourceItem(BaseModel):
    numero_article: str
    titre: str
    livre: str
    source_url: str
    extrait: str


class AskResponse(BaseModel):
    reponse: str
    sources: list[SourceItem]


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 caractères")
    type_compte: TypeCompte

    # Champs individu (requis si type_compte == individu)
    nom: str | None = None
    prenom: str | None = None

    # Champs institution (requis si type_compte == institution)
    nom_institution: str | None = None
    secteur_activite: str | None = None
    nombre_employes: int | None = None

    @model_validator(mode="after")
    def valider_champs_selon_type(self):
        if self.type_compte == TypeCompte.individu:
            if not self.nom or not self.prenom:
                raise ValueError("Les champs 'nom' et 'prenom' sont requis pour un compte individu.")
        elif self.type_compte == TypeCompte.institution:
            if not self.nom_institution or not self.secteur_activite:
                raise ValueError(
                    "Les champs 'nom_institution' et 'secteur_activite' sont requis pour un compte institution."
                )
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: str
    type_compte: TypeCompte
    nom: str | None = None
    prenom: str | None = None
    nom_institution: str | None = None
    secteur_activite: str | None = None
    nombre_employes: int | None = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


@app.post("/auth/register", response_model=TokenResponse, status_code=201)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=409, detail="Un compte existe déjà avec cet email.")

    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        type_compte=request.type_compte,
        nom=request.nom,
        prenom=request.prenom,
        nom_institution=request.nom_institution,
        secteur_activite=request.secteur_activite,
        nombre_employes=request.nombre_employes,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user))


@app.post("/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user))


@app.get("/auth/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)):
    return UserPublic.model_validate(current_user)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/pays")
def get_pays():
    """Liste des pays disponibles -- alimente le sélecteur de pays du frontend."""
    return [
        {"code": code, **infos}
        for code, infos in PAYS_DISPONIBLES.items()
    ]


@app.post("/ask", response_model=AskResponse)
def ask_endpoint(request: AskRequest):
    if request.pays not in PAYS_DISPONIBLES:
        raise HTTPException(
            status_code=400,
            detail=f"Pays inconnu : '{request.pays}'. Pays disponibles : {list(PAYS_DISPONIBLES.keys())}",
        )

    infos = PAYS_DISPONIBLES[request.pays]
    domaine = infos["domaine"]
    embedder_key = f"{request.pays}_{domaine}"

    if embedder_key not in app.state.embedders:
        raise HTTPException(status_code=500, detail="Index non initialisé pour ce pays.")

    result = rag_ask(
        client=app.state.client,
        embedder=app.state.embedders[embedder_key],
        lexical_index=app.state.lexical_indexes[embedder_key],
        generator=app.state.generator,
        pays=request.pays,
        domaine=domaine,
        question=request.question,
        top_k=request.top_k,
        distance_threshold=app.state.distance_threshold,
    )
    return result

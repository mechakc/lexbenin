# LexBénin

Un assistant juridique multi-pays qui répond aux questions des citoyens en langage simple, en citant systématiquement les articles de loi exacts sur lesquels il s'appuie — et en refusant de répondre plutôt que d'inventer, dès qu'une question sort de son périmètre indexé.

> ⚠️ **Ceci n'est pas un conseil juridique professionnel.** LexBénin vulgarise et cite la loi ; pour toute situation complexe ou litigieuse, consultez un professionnel du droit.

## Pourquoi ce projet

Beaucoup de citoyens n'ont pas facilement accès à une explication fiable et vulgarisée de leurs droits, ce qui les rend vulnérables à la désinformation juridique ("on m'a dit que...", rumeurs, fausses infos en ligne). LexBénin ne se contente pas de répondre : il apprend à distinguer une information juridique fiable d'une rumeur, via la citation systématique des sources et la transparence sur l'incertitude.

**Périmètre actuel :**

| Pays | Domaine de droit | Source |
|---|---|---|
| Bénin | Droit numérique | Loi n°2017-20 portant Code du numérique |
| France | Fiscalité des particuliers (IR) | Code général des impôts (extraits IR) |

## Architecture

```
[Frontend React] → [Backend FastAPI] → [Recherche hybride scopée par pays] → [LLM] → [Réponse + sources]
```

Le pipeline RAG suit toujours le même chemin pour chaque question :

1. **Indexation** (en amont, une fois par pays) — texte de loi → découpage par article → embeddings → stockage dans une collection ChromaDB dédiée au pays/domaine (isolation garantie au niveau du stockage, pas juste par filtre applicatif)
2. **Recherche hybride** — vectorielle (sens, via embeddings Mistral) + lexicale BM25 (correspondances exactes, tolérante aux fautes/accents), fusionnées par Reciprocal Rank Fusion
3. **Garde-fou hors périmètre** — une question n'est rejetée que si les *deux* signaux sont mauvais à la fois (distance vectorielle élevée **et** aucun ancrage lexical fort), pour éviter qu'une question mal formulée soit rejetée à tort
4. **Prompt + génération** — le LLM ne reçoit que les articles récupérés comme source, avec des règles strictes anti-hallucination (interdiction d'attribuer une règle à un article qui ne la contient pas, interdiction d'ajouter des connaissances générales même signalées comme non sourcées)
5. **Vérification (optionnelle)** — un second appel LLM relit chaque affirmation et vérifie qu'elle est bien fondée dans les articles reçus, active via `VERIFY_ANSWERS=true`

## Structure du repo

```
lexbenin/
├── app/                      # Frontend React
│   ├── components/
│   ├── pages/
│   ├── chat/
│   └── ...
├── public/
├── backend/                  # Backend FastAPI (voir backend/README ou section ci-dessous)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # Point d'entrée FastAPI, endpoints
│   │   ├── auth.py           # JWT + bcrypt
│   │   ├── database.py       # SQLAlchemy / SQLite
│   │   └── models_db.py      # Modèle User
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── pipeline.py       # Indexation + recherche hybride
│   │   ├── ask.py            # Pipeline complet question → réponse
│   │   ├── embeddings.py     # Backends TF-IDF / e5 / Mistral
│   │   ├── lexical.py        # Index BM25 + RRF
│   │   ├── llm.py            # Prompts + backends de génération
│   │   ├── test_cli.py       # CLI de test du pipeline
│   │   └── calibrate_threshold.py
│   ├── data/
│   │   ├── benin/articles_benin.json
│   │   └── france/articles_france.json
│   ├── requirements.txt
│   └── .env.example
├── package.json
└── README.md                 # ce fichier
```

## Prérequis

- Node.js 18+ et npm
- Python 3.11+
- Une clé API Mistral (pour les embeddings et la génération en production) — [console.mistral.ai](https://console.mistral.ai)

## Installation — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows : venv\Scripts\activate
pip install -r requirements.txt
```

Crée un fichier `.env` (ou exporte les variables) à partir de `.env.example` :

```bash
MISTRAL_API_KEY=ta_clé_mistral
EMBEDDING_BACKEND=mistral      # "tfidf" (test local, aucune clé requise) | "e5" | "mistral" (prod)
LLM_BACKEND=mistral            # "mock" (test, aucun appel réseau) | "mistral" (prod)
DISTANCE_THRESHOLD=            # à calibrer via rag/calibrate_threshold.py — voir plus bas
VERIFY_ANSWERS=false           # true = double passage LLM pour vérifier chaque citation
AUTH_SECRET_KEY=une_valeur_aleatoire_et_secrete   # jamais la valeur par défaut en prod
DATABASE_URL=sqlite:///./lexbenin.db             # ou une URL Postgres en prod
```

Place tes données de loi dans `backend/data/<pays>/articles_<pays>.json`, sous la forme d'une liste d'articles avec ce schéma :

```json
{
  "id": "benin_art_13",
  "pays": "benin",
  "domaine": "droit_numerique",
  "numero_article": "13",
  "titre_article": "Droit d'accès à internet",
  "livre": "LIVRE PRELIMINAIRE",
  "source_url": "https://...",
  "texte_pour_embedding": "Texte intégral de l'article..."
}
```

Lance le serveur (depuis `backend/`, pour que les chemins relatifs `./data/...` et `./rag/chroma_db` résolvent correctement) :

```bash
uvicorn app.main:app --reload
```

L'index RAG est construit une seule fois au démarrage (voir `lifespan` dans `app/main.py`), pas à chaque requête.

### Tester le pipeline sans backend web

```bash
# Test rapide en local, sans clé API (backend TF-IDF)
python3 -m rag.test_cli

# Tests unitaires (fonctions pures + garde-fou hors-périmètre, 100 % local)
python3 -m pytest

# Calibrer distance_threshold sur ton vrai backend d'embeddings (nécessite MISTRAL_API_KEY)
python3 -m rag.calibrate_threshold
```

⚠️ `distance_threshold` dépend entièrement du backend d'embeddings utilisé (TF-IDF, e5 et mistral-embed n'ont pas la même échelle de distance). Recalibre-le à chaque changement de backend.

## Installation — Frontend

```bash
npm install
npm run dev
```

Configure l'URL du backend (ex. `VITE_API_URL` ou équivalent selon ton setup de build) pour qu'elle pointe vers ton instance FastAPI (`http://localhost:8000` en local).

## Endpoints principaux

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Healthcheck |
| GET | `/pays` | Liste des pays/domaines disponibles (alimente le sélecteur) |
| POST | `/ask` | `{ pays, question, top_k? }` → `{ reponse, sources[] }` |
| POST | `/auth/register` | Créer un compte (individu ou institution) |
| POST | `/auth/login` | Connexion, retourne un JWT |
| GET | `/auth/me` | Profil de l'utilisateur connecté |

## Déploiement

Stack pensée pour un hébergement gratuit/accessible :

- **Frontend** : Vercel
- **Backend** : Render / Railway / Hugging Face Spaces

⚠️ En développement, le CORS du backend autorise toutes les origines par défaut. En production, définis `ALLOWED_ORIGINS` (liste d'URL séparées par des virgules, ex. `https://lexbenin.vercel.app`) pour le restreindre à l'URL du frontend déployé — sans éditer le code. De même, `AUTH_SECRET_KEY` a une valeur par défaut de développement dans `app/auth.py` : à écraser obligatoirement via variable d'environnement en prod.

Si tu utilises le backend d'embeddings `e5` en production, note que `multilingual-e5-large` charge ~2,2 Go en mémoire — au-delà des tiers gratuits de la plupart des hébergeurs. Le backend `mistral` (appels API légers, rien chargé en local) est recommandé pour un déploiement à mémoire limitée.

## Roadmap / hors périmètre actuel

- Ajout automatisé de nouveaux pays
- Génération de courriers/documents juridiques
- Autres domaines de droit
- Volet B2B (formation juridique gamifiée par poste/métier, dashboard de conformité) — piste de durabilité post-hackathon, non développée techniquement

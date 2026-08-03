"""
Backends d'embeddings interchangeables pour le pipeline RAG.

Deux implémentations :
- TfidfEmbedder : 100% local, aucun téléchargement requis. Utile pour tester la
  logique du pipeline (chunking -> indexation -> recherche) dans un environnement
  sans accès à Hugging Face. NE PAS utiliser en production : le TF-IDF ne capture
  pas le sens, seulement la présence de mots-clés, donc la recherche est bien
  moins pertinente qu'avec un vrai modèle d'embeddings sémantiques.
- E5MultilingualEmbedder : le vrai backend de production, basé sur
  intfloat/multilingual-e5-large (Hugging Face). Nécessite `sentence-transformers`
  et un accès réseau à huggingface.co pour télécharger le modèle la première fois.

Les deux respectent la même interface (fit/embed_documents/embed_query), donc le
reste du pipeline (indexation, recherche) n'a pas à savoir lequel est utilisé.
"""

from abc import ABC, abstractmethod
import numpy as np


class BaseEmbedder(ABC):
    @abstractmethod
    def fit(self, documents: list[str]) -> None:
        """Entraîne l'embedder si nécessaire (TF-IDF en a besoin, e5 non)."""

    @abstractmethod
    def embed_documents(self, documents: list[str]) -> list[list[float]]:
        """Retourne un vecteur par document."""

    @abstractmethod
    def embed_query(self, query: str) -> list[float]:
        """Retourne un vecteur pour une question utilisateur."""


class TfidfEmbedder(BaseEmbedder):
    """Backend de test, 100% local, sans téléchargement. À ne PAS utiliser en prod."""

    def __init__(self, max_features: int = 4096):
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=(1, 2),
            sublinear_tf=True,
        )
        self._fitted = False

    def fit(self, documents: list[str]) -> None:
        self.vectorizer.fit(documents)
        self._fitted = True

    def embed_documents(self, documents: list[str]) -> list[list[float]]:
        if not self._fitted:
            raise RuntimeError("Appeler fit() avant embed_documents().")
        return self.vectorizer.transform(documents).toarray().tolist()

    def embed_query(self, query: str) -> list[float]:
        if not self._fitted:
            raise RuntimeError("Appeler fit() avant embed_query().")
        return self.vectorizer.transform([query]).toarray()[0].tolist()


class E5MultilingualEmbedder(BaseEmbedder):
    """
    Backend de PRODUCTION : intfloat/multilingual-e5-large via sentence-transformers.

    Important pour ce modèle : e5 attend un préfixe "query: " pour les questions
    et "passage: " pour les documents indexés -- sans ça, les scores de similarité
    sont nettement moins bons. C'est géré automatiquement ici.

    Nécessite : pip install sentence-transformers
    Nécessite un accès réseau à huggingface.co au premier chargement (le modèle
    est ensuite mis en cache localement, ~1.1 Go).
    """

    def __init__(self, model_name: str = "intfloat/multilingual-e5-large"):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)

    def fit(self, documents: list[str]) -> None:
        pass  # e5 est pré-entraîné, rien à faire ici

    def embed_documents(self, documents: list[str]) -> list[list[float]]:
        prefixed = [f"passage: {doc}" for doc in documents]
        embeddings = self.model.encode(prefixed, normalize_embeddings=True)
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        embedding = self.model.encode(f"query: {query}", normalize_embeddings=True)
        return embedding.tolist()


class MistralEmbedder(BaseEmbedder):
    """
    Backend de PRODUCTION alternatif à e5 : utilise l'API Mistral (mistral-embed)
    au lieu de charger un modèle en local.

    Pourquoi ce backend existe : e5-large charge ~2,24 Go de poids en mémoire
    (+ torch + transformers), ce qui dépasse largement les 512 Mo de RAM du tier
    gratuit de la plupart des hébergeurs (ex: Render free). Ce backend ne charge
    RIEN en local -- juste des appels HTTP légers -- donc utilisable sur un
    serveur à mémoire très limitée. Contrepartie : dépend d'un appel réseau par
    lot de documents (facturé au tier Mistral, comme la génération).

    Dimension des vecteurs : 1024 (identique à multilingual-e5-large, mais les
    échelles de distance ne sont PAS comparables entre les deux modèles -- si tu
    changes de backend d'embedding, il faut RECALIBRER distance_threshold
    (voir rag/calibrate_threshold.py), l'ancienne valeur ne s'applique plus.

    Nécessite : MISTRAL_API_KEY dans l'environnement (la même clé que pour la
    génération).
    """

    def __init__(self, model: str = "mistral-embed", batch_size: int = 32):
        import os
        self.api_key = os.environ.get("MISTRAL_API_KEY")
        if not self.api_key:
            raise RuntimeError("MISTRAL_API_KEY non définie dans l'environnement.")
        self.model = model
        self.batch_size = batch_size

    def fit(self, documents: list[str]) -> None:
        pass  # rien à entraîner, l'API fait le travail

    def _call_api(self, texts: list[str], max_retries: int = 5) -> list[list[float]]:
        import time
        import requests

        for attempt in range(max_retries):
            response = requests.post(
                "https://api.mistral.ai/v1/embeddings",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model, "input": texts},
                timeout=60,
            )

            if response.status_code == 429:
                # Rate limit atteint -- on respecte Retry-After si fourni,
                # sinon backoff exponentiel (2s, 4s, 8s, 16s, 32s).
                retry_after = response.headers.get("Retry-After")
                wait = float(retry_after) if retry_after else (2 ** (attempt + 1))
                print(f"[MistralEmbedder] Rate limit atteint (tentative {attempt + 1}/{max_retries}), "
                      f"attente {wait:.1f}s avant nouvel essai...")
                time.sleep(wait)
                continue

            if not response.ok:
                print(f"[MistralEmbedder] Erreur API {response.status_code} : {response.text}")
                print(f"[MistralEmbedder] Nombre de textes envoyés : {len(texts)}, "
                      f"longueur max : {max((len(t) for t in texts), default=0)} caractères")
            response.raise_for_status()
            data = response.json()["data"]
            data.sort(key=lambda d: d["index"])
            return [d["embedding"] for d in data]

        raise RuntimeError(
            f"[MistralEmbedder] Échec après {max_retries} tentatives (rate limit persistant)."
        )

    @staticmethod
    def _split_oversized(text: str, max_chars: int = 6000) -> list[str]:
        """Découpe un texte trop long en plusieurs morceaux (l'API rejette les
        entrées trop longues, ex: l'article 1er du Code du numérique béninois
        qui contient ~150 définitions en un seul bloc de 51 000+ caractères).
        Coupe de préférence sur des sauts de ligne pour ne pas trancher au
        milieu d'une phrase."""
        if len(text) <= max_chars:
            return [text]

        pieces: list[str] = []
        remaining = text
        while len(remaining) > max_chars:
            cut = remaining.rfind("\n", 0, max_chars)
            if cut == -1 or cut < max_chars * 0.5:
                cut = max_chars  # pas de saut de ligne pratique -> coupe brute
            pieces.append(remaining[:cut])
            remaining = remaining[cut:]
        if remaining.strip():
            pieces.append(remaining)
        return pieces

    def _embed_one(self, text: str) -> list[float]:
        """Embedde un texte, en le découpant et en moyennant les vecteurs
        obtenus s'il est trop long pour une seule requête."""
        pieces = self._split_oversized(text)
        if len(pieces) == 1:
            return self._call_api(pieces)[0]

        import numpy as np
        sub_vectors = self._call_api(pieces)
        averaged = np.mean(np.array(sub_vectors), axis=0)
        return averaged.tolist()

    def embed_documents(self, documents: list[str]) -> list[list[float]]:
        import time

        all_embeddings: list[list[float]] = []
        for i in range(0, len(documents), self.batch_size):
            batch = documents[i:i + self.batch_size]
            # Si un texte du lot dépasse la limite, on isole tout le lot pour
            # le traiter texte par texte (permet le découpage individuel sans
            # perturber les autres documents du même lot).
            if any(len(t) > 6000 for t in batch):
                for t in batch:
                    all_embeddings.append(self._embed_one(t))
            else:
                all_embeddings.extend(self._call_api(batch))

            # Petite pause entre les lots -- évite de déclencher le rate limit
            # dès le départ plutôt que de compter uniquement sur les retries.
            if i + self.batch_size < len(documents):
                time.sleep(1.0)
        return all_embeddings

    def embed_query(self, query: str) -> list[float]:
        return self._embed_one(query)


def get_embedder(backend: str = "tfidf") -> BaseEmbedder:
    """Factory pour choisir le backend au moment de l'exécution."""
    if backend == "tfidf":
        return TfidfEmbedder()
    elif backend == "e5":
        return E5MultilingualEmbedder()
    elif backend == "mistral":
        return MistralEmbedder()
    else:
        raise ValueError(f"Backend inconnu : {backend}. Choix possibles : 'tfidf', 'e5', 'mistral'.")

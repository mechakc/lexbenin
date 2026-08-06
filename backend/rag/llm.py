"""
Brique de génération : prend la question + les articles récupérés par le RAG,
construit le prompt système, et appelle le LLM pour produire la réponse
vulgarisée avec citations.

Backends interchangeables (même pattern que rag/embeddings.py) :
- MistralGenerator : backend de PRODUCTION, via l'API Mistral (tier gratuit).
- MockGenerator : backend de TEST, ne fait aucun appel réseau. Simule une
  réponse déterministe pour vérifier que le prompt est bien construit et que
  le flux recherche -> prompt -> réponse fonctionne mécaniquement. Ne produit
  PAS une vraie réponse vulgarisée -- à utiliser uniquement pour du debug.
"""

from abc import ABC, abstractmethod


SYSTEM_PROMPT_TEMPLATE = """Tu es un assistant juridique pédagogique pour {pays_label}, spécialisé en {domaine_label}.

RÈGLES STRICTES :
1. Réponds UNIQUEMENT à partir des articles de loi fournis ci-dessous. N'invente jamais d'information.
2. Cite systématiquement le numéro exact de chaque article sur lequel tu t'appuies (ex: "selon l'article 13 du Code du numérique").
3. Si les articles fournis ne permettent pas de répondre complètement à la question, dis-le explicitement plutôt que de deviner ou d'extrapoler.
4. Utilise un ton pédagogique : phrases courtes, vocabulaire simple, explique le jargon juridique quand tu dois l'utiliser.
5. Termine toujours par un rappel que ceci n'est pas un conseil juridique professionnel définitif, et que pour les situations complexes ou litigieuses, il faut consulter un professionnel du droit.
6. Distingue clairement "ce que dit la loi" (fait) de "ce qu'il faut vérifier avec un professionnel" (zone d'incertitude) -- c'est le cœur de la mission pédagogique de cet outil (littératie de l'information juridique).
7. Si tu dois faire un calcul, une déduction ou une combinaison à partir du texte de loi (ex: appliquer un doublement de peine mentionné dans un article, additionner des seuils, combiner plusieurs alinéas), indique-le explicitement (ex: "en appliquant le doublement prévu par l'article X, cela donnerait...") plutôt que de présenter le résultat comme une citation directe de la loi. Le lecteur doit pouvoir distinguer ce qui est écrit noir sur blanc dans le texte de ce qui est ton interprétation ou ton calcul.
8. INTERDICTION ABSOLUE d'attribuer à un article une peine, un montant, une durée ou une règle qu'il ne contient pas réellement. Avant de citer un article à l'appui d'une affirmation, vérifie que cette affirmation figure vraiment dans le texte fourni de cet article. Si le sujet de la question (ex: vol, recel, mariage, droit foncier, droit du travail) n'est traité par AUCUN des articles fournis, dis-le explicitement dès le début de ta réponse ("Aucun des articles fournis ne traite de [sujet]") plutôt que de rattacher artificiellement la question à un article qui parle d'autre chose. Un article mal cité est pire qu'une absence de réponse : il donne une fausse impression d'autorité légale à une information inventée.

ARTICLES DE LOI FOURNIS (ta seule source d'information) :
{articles_context}
"""


def build_prompt(question: str, articles: list[dict], pays: str, domaine_label: str) -> dict:
    """Construit le system prompt + le message utilisateur à partir des articles
    récupérés par la recherche RAG (voir rag/pipeline.py::search)."""
    pays_label = {"benin": "le Bénin", "france": "la France"}.get(pays, pays)

    articles_context = "\n\n".join(
        f"--- Article {a['metadata']['numero_article']} "
        f"({a['metadata'].get('livre', '') or a['metadata'].get('titre_article', '')}) ---\n"
        f"{a['texte']}"
        for a in articles
    )

    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        pays_label=pays_label,
        domaine_label=domaine_label,
        articles_context=articles_context,
    )

    return {"system": system_prompt, "user": question}


VERIFICATION_PROMPT_TEMPLATE = """Tu es un vérificateur strict de fidélité aux sources, pour un assistant juridique.

On te donne : (1) les articles de loi qui ont servi de source, (2) une réponse déjà générée à partir de ces articles.

TA SEULE TÂCHE : vérifier que CHAQUE affirmation attribuée à un article figure RÉELLEMENT dans le texte de cet article fourni ci-dessous. Ne vérifie rien d'autre (style, longueur, ton -- laisse tel quel).

RÈGLES :
1. Si une affirmation attribuée à un article X n'apparaît PAS dans le texte fourni de l'article X, tu dois soit la retirer, soit la reformuler pour dire explicitement que ce point n'est pas couvert par les articles fournis.
2. Si un calcul ou une déduction non explicitement marqué comme tel est présenté comme une citation directe, corrige la formulation pour le marquer clairement comme une déduction.
3. Ne rajoute AUCUNE nouvelle information, ne cite aucun nouvel article.
4. Si toute la réponse est déjà fidèle aux sources, renvoie-la sans aucune modification.
5. Retourne UNIQUEMENT la réponse corrigée (même format que l'originale : markdown, structure identique), sans commentaire ni explication de ta correction.

ARTICLES SOURCES (seule référence valide) :
{articles_context}

RÉPONSE À VÉRIFIER :
{answer}
"""


def build_verification_prompt(answer: str, articles: list[dict]) -> dict:
    """Construit le prompt du second passage : demande au LLM de vérifier que
    chaque affirmation de `answer` est réellement fondée dans les articles
    sources, et de corriger silencieusement ce qui ne l'est pas.
    Utilisé uniquement si VERIFY_ANSWERS=true (voir rag/ask.py)."""
    articles_context = "\n\n".join(
        f"--- Article {a['metadata']['numero_article']} "
        f"({a['metadata'].get('livre', '') or a['metadata'].get('titre_article', '')}) ---\n"
        f"{a['texte']}"
        for a in articles
    )
    system_prompt = VERIFICATION_PROMPT_TEMPLATE.format(
        articles_context=articles_context, answer=answer
    )
    return {"system": system_prompt, "user": "Vérifie et corrige si nécessaire."}


class BaseGenerator(ABC):
    @abstractmethod
    def generate(self, system_prompt: str, user_message: str) -> str:
        ...


class MistralGenerator(BaseGenerator):
    """Backend de PRODUCTION. Nécessite MISTRAL_API_KEY dans l'environnement.
    Utilise le modèle gratuit (tier limité) mistral-small-latest."""

    def __init__(self, model: str = "mistral-small-latest"):
        import os
        self.api_key = os.environ.get("MISTRAL_API_KEY")
        if not self.api_key:
            raise RuntimeError("MISTRAL_API_KEY non définie dans l'environnement.")
        self.model = model

    def generate(self, system_prompt: str, user_message: str, max_retries: int = 5) -> str:
        # Même gestion du rate-limit que MistralEmbedder._call_api (voir
        # rag/embeddings.py) : le tier gratuit renvoie facilement des 429, et
        # sans retry l'utilisateur récupère une 500 brute. On respecte
        # Retry-After si fourni, sinon backoff exponentiel (2s, 4s, 8s...).
        import time
        import requests

        for attempt in range(max_retries):
            response = requests.post(
                "https://api.mistral.ai/v1/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "temperature": 0.2,  # faible température : on veut de la précision, pas de la créativité
                },
                timeout=30,
            )

            if response.status_code == 429:
                retry_after = response.headers.get("Retry-After")
                wait = float(retry_after) if retry_after else (2 ** (attempt + 1))
                print(f"[MistralGenerator] Rate limit atteint (tentative {attempt + 1}/{max_retries}), "
                      f"attente {wait:.1f}s avant nouvel essai...")
                time.sleep(wait)
                continue

            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]

        raise RuntimeError(
            f"[MistralGenerator] Échec après {max_retries} tentatives (rate limit persistant)."
        )


class MockGenerator(BaseGenerator):
    """Backend de TEST -- aucun appel réseau. Vérifie juste que le prompt contient
    bien les articles attendus et retourne un résumé factice, pour valider la
    plomberie (recherche -> prompt -> réponse) sans dépendre d'une clé API."""

    def generate(self, system_prompt: str, user_message: str) -> str:
        nb_articles = system_prompt.count("--- Article")
        apercu_prompt = system_prompt[:200].replace("\n", " ")
        return (
            f"[MOCK -- pas une vraie réponse] "
            f"Le prompt contient {nb_articles} article(s) de loi en contexte. "
            f"Question posée : « {user_message} ». "
            f"Début du system prompt : {apercu_prompt}..."
        )


def get_generator(backend: str = "mock") -> BaseGenerator:
    if backend == "mistral":
        return MistralGenerator()
    elif backend == "mock":
        return MockGenerator()
    else:
        raise ValueError(f"Backend inconnu : {backend}. Choix possibles : 'mistral', 'mock'.")

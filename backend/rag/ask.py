"""
Point d'entrée unique du pipeline complet : question -> recherche -> génération.
C'est cette fonction `ask()` que le backend FastAPI (Semaine 3) appellera.
"""

import sys
sys.path.insert(0, ".")

import os
import chromadb
from rag.pipeline import search, CHROMA_PATH, collection_name
from rag.embeddings import BaseEmbedder
from rag.lexical import LexicalIndex
from rag.llm import build_prompt, build_verification_prompt, get_generator, BaseGenerator


DOMAINE_LABELS = {
    "droit_numerique": "droit numérique",
    "fiscalite_ir": "fiscalité des particuliers (impôt sur le revenu)",
}


def ask(
    client: chromadb.ClientAPI,
    embedder: BaseEmbedder,
    lexical_index: LexicalIndex,
    generator: BaseGenerator,
    pays: str,
    domaine: str,
    question: str,
    top_k: int = 5,
    distance_threshold: float | None = None,
    verify_answer: bool | None = None,
) -> dict:
    """
    Pipeline complet pour une question utilisateur :
    1. Recherche HYBRIDE (vectorielle + lexicale BM25, fusionnées par RRF)
       scopée au pays/domaine -> top_k articles (voir rag/pipeline.py::search)
    2. Si le meilleur match VECTORIEL BRUT est trop éloigné sémantiquement
       (distance_threshold), on considère la question hors périmètre et on ne
       consulte PAS le LLM -- ça évite qu'il "force" une réponse à partir
       d'articles non pertinents. Cette décision est volontairement basée sur
       la distance vectorielle brute, pas sur le classement fusionné (voir
       docstring de search()).
    3. Sinon : construction du prompt avec ces articles comme seule source
    4. Appel au LLM pour la réponse vulgarisée
    5. Si verify_answer est actif : second appel au LLM pour vérifier que
       chaque affirmation est bien fondée dans les articles sources, et
       corriger silencieusement ce qui ne l'est pas (voir rag/llm.py::
       build_verification_prompt). Coûte un appel API supplémentaire par
       question -- désactivé par défaut, à activer via VERIFY_ANSWERS=true
       ou l'argument verify_answer si le risque d'hallucination pèse plus
       que le coût/latence supplémentaire pour ton cas d'usage.

    Retourne la réponse ET les sources utilisées séparément, pour que le
    frontend puisse afficher les articles cités dans un encadré distinct
    (voir cahier des charges, section 3 : "Affichage réponse + articles cités").

    IMPORTANT sur distance_threshold : sa valeur dépend du backend d'embeddings
    utilisé (TF-IDF, e5 et mistral-embed n'ont PAS la même échelle de distance).
    Il n'y a PAS de valeur universelle -- à calibrer empiriquement sur ton
    backend réel (voir rag/calibrate_threshold.py) avant de l'activer en
    production. Si None (défaut), cette vérification est désactivée.
    """
    if verify_answer is None:
        verify_answer = os.environ.get("VERIFY_ANSWERS", "false").lower() == "true"

    retrieved, best_vector_distance, top_result_lexically_grounded = search(
        client, embedder, lexical_index, pays, domaine, question, top_k=top_k
    )

    if not retrieved:
        return {
            "reponse": "Aucun article pertinent n'a été trouvé pour cette question dans notre base. "
                       "Nous vous recommandons de consulter un professionnel du droit.",
            "sources": [],
        }

    # Rejette comme "hors périmètre" seulement si LES DEUX signaux sont mauvais :
    # distance vectorielle élevée ET aucun ancrage lexical fort. Une question mal
    # formulée (fautes, sans accents, familière) peut avoir une distance vectorielle
    # médiocre tout en partageant clairement du vocabulaire avec le bon article --
    # dans ce cas, top_result_lexically_grounded=True évite un rejet à tort.
    hors_perimetre = (
        distance_threshold is not None
        and best_vector_distance > distance_threshold
        and not top_result_lexically_grounded
    )
    if hors_perimetre:
        return {
            "reponse": (
                "Cette question semble sortir du périmètre couvert par cet assistant "
                f"(actuellement limité à : {DOMAINE_LABELS.get(domaine, domaine)} pour {pays}). "
                "Nous ne pouvons pas répondre de façon fiable sans risquer de vous donner une "
                "information trompeuse. Pour cette question, nous vous recommandons de consulter "
                "un professionnel du droit compétent sur le sujet, ou une ressource juridique "
                "adaptée à ce domaine."
            ),
            "sources": [],
        }

    domaine_label = DOMAINE_LABELS.get(domaine, domaine)
    prompt = build_prompt(question, retrieved, pays, domaine_label)
    reponse = generator.generate(prompt["system"], prompt["user"])

    if verify_answer:
        verif_prompt = build_verification_prompt(reponse, retrieved)
        reponse = generator.generate(verif_prompt["system"], verif_prompt["user"])

    sources = [
        {
            "numero_article": r["metadata"]["numero_article"],
            "titre": r["metadata"].get("titre_article", ""),
            "livre": r["metadata"].get("livre", ""),
            "source_url": r["metadata"].get("source_url", ""),
            "extrait": r["texte"][:200],
        }
        for r in retrieved
    ]

    return {"reponse": reponse, "sources": sources}

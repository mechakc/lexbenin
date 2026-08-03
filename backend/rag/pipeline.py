"""
Pipeline RAG : indexation des articles de loi par pays et recherche scopée.

Chaque pays a sa propre collection ChromaDB (ex: "benin_droit_numerique",
"france_fiscalite_ir"), donc une question posée pour un pays ne peut jamais
remonter d'articles d'un autre pays -- l'isolation est garantie au niveau du
stockage, pas juste par un filtre applicatif.
"""

import json
import chromadb
from pathlib import Path
from rag.embeddings import get_embedder, BaseEmbedder
from rag.lexical import build_lexical_index, reciprocal_rank_fusion, LexicalIndex


CHROMA_PATH = "./rag/chroma_db"


def load_articles(json_path: str) -> list[dict]:
    return json.loads(Path(json_path).read_text(encoding="utf-8"))


def collection_name(pays: str, domaine: str) -> str:
    return f"{pays}_{domaine}"


def index_country(
    client: chromadb.ClientAPI,
    embedder: BaseEmbedder,
    articles: list[dict],
    pays: str,
    domaine: str,
) -> LexicalIndex:
    """Indexe tous les articles d'un pays dans sa propre collection ChromaDB,
    et construit en parallèle un index lexical BM25 (voir rag/lexical.py) sur
    les mêmes articles, retourné pour être utilisé à la recherche."""
    name = collection_name(pays, domaine)

    # Repart de zéro à chaque indexation pour éviter les doublons lors des tests répétés
    try:
        client.delete_collection(name)
    except Exception:
        pass
    collection = client.create_collection(name)

    texts = [a["texte_pour_embedding"] for a in articles]

    # Le TF-IDF doit être entraîné sur le corpus du pays courant ; e5 n'en a pas besoin
    embedder.fit(texts)
    vectors = embedder.embed_documents(texts)

    collection.add(
        ids=[a["id"] for a in articles],
        embeddings=vectors,
        documents=texts,
        metadatas=[
            {
                "pays": a["pays"],
                "domaine": a["domaine"],
                "numero_article": a["numero_article"],
                "titre_article": a.get("titre_article", ""),
                "livre": a.get("livre", ""),
                "source_url": a.get("source_url", ""),
            }
            for a in articles
        ],
    )
    lexical_index = build_lexical_index(articles)
    print(f"[{name}] {len(articles)} articles indexés (vectoriel + lexical).")
    return lexical_index


def search(
    client: chromadb.ClientAPI,
    embedder: BaseEmbedder,
    lexical_index: LexicalIndex,
    pays: str,
    domaine: str,
    question: str,
    top_k: int = 5,
) -> tuple[list[dict], float, bool]:
    """Recherche hybride : combine recherche vectorielle (sens) et recherche
    lexicale BM25 (correspondances exactes -- numéro d'article, terme rare),
    fusionnées par Reciprocal Rank Fusion (voir rag/lexical.py).

    Retourne (hits, best_vector_distance, top_result_lexically_grounded).

    - best_vector_distance : distance vectorielle brute du tout meilleur match
      vectoriel, indépendamment de l'ordre final après fusion.
    - top_result_lexically_grounded : True si le document classé en tête après
      fusion apparaît aussi dans le top 3 du classement lexical seul -- un
      signe que ce n'est pas juste une dérive sémantique (mots partagés par
      hasard) mais un vrai recouvrement de vocabulaire avec la question.

    rag/ask.py utilise ces DEUX signaux pour la décision "hors périmètre" :
    une question est acceptée si la distance vectorielle est bonne, OU si le
    meilleur résultat est solidement ancré lexicalement -- ça évite qu'une
    question mal formulée ou familière (fautes, sans accents, tournures
    familières) se fasse rejeter à tort alors que le bon article existe et
    partage clairement du vocabulaire avec la question.
    """
    name = collection_name(pays, domaine)
    collection = client.get_collection(name)

    # Fenêtre plus large que top_k pour laisser de la place à la fusion
    fetch_k = max(top_k * 2, 10)

    query_vector = embedder.embed_query(question)
    vector_results = collection.query(query_embeddings=[query_vector], n_results=fetch_k)

    vector_ids = vector_results["ids"][0]
    vector_distances = {doc_id: vector_results["distances"][0][i] for i, doc_id in enumerate(vector_ids)}
    best_vector_distance = min(vector_distances.values()) if vector_distances else 1.0

    if not vector_ids:
        return [], best_vector_distance, False

    lexical_hits = lexical_index.search(question, top_k=fetch_k)
    lexical_ids = [doc_id for doc_id, _score in lexical_hits]

    # Fusion des deux classements. Si la recherche lexicale ne remonte rien
    # (aucun recouvrement de mots), on retombe simplement sur le classement
    # vectoriel seul -- la fusion RRF avec une seule liste non vide équivaut
    # à ce classement, donc pas de cas particulier à gérer explicitement.
    fused_scores = reciprocal_rank_fusion([vector_ids, lexical_ids])
    final_ids = sorted(fused_scores.keys(), key=lambda i: -fused_scores[i])[:top_k]

    top_result_lexically_grounded = bool(final_ids) and final_ids[0] in lexical_ids[:3]

    # Récupère texte/métadonnées pour l'ensemble final (certains ids peuvent
    # venir uniquement du classement lexical, donc pas déjà dans vector_results)
    fetched = collection.get(ids=final_ids)
    texte_par_id = dict(zip(fetched["ids"], fetched["documents"]))
    meta_par_id = dict(zip(fetched["ids"], fetched["metadatas"]))

    hits = []
    for doc_id in final_ids:
        hits.append({
            "id": doc_id,
            # Distance vectorielle du document lui-même (utile pour l'affichage/debug),
            # à ne PAS confondre avec best_vector_distance utilisé pour le seuil.
            "distance": vector_distances.get(doc_id, best_vector_distance),
            "texte": texte_par_id.get(doc_id, ""),
            "metadata": meta_par_id.get(doc_id, {}),
        })
    return hits, best_vector_distance, top_result_lexically_grounded


def build_index(
    backend: str = "tfidf",
) -> tuple[chromadb.ClientAPI, dict[str, BaseEmbedder], dict[str, LexicalIndex]]:
    """Construit l'index complet (Bénin + France) et retourne le client + les
    embedders utilisés (un embedder par pays car TF-IDF doit être ré-entraîné
    par corpus ; avec e5/mistral un seul embedder partagé suffirait) + les
    index lexicaux BM25 (un par pays, pour la recherche hybride)."""
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    embedders = {}
    lexical_indexes = {}

    benin_articles = load_articles("./data/benin/articles_benin.json")
    embedder_benin = get_embedder(backend)
    lexical_indexes["benin_droit_numerique"] = index_country(
        client, embedder_benin, benin_articles, "benin", "droit_numerique"
    )
    embedders["benin_droit_numerique"] = embedder_benin

    france_articles = load_articles("./data/france/articles_france.json")
    embedder_france = get_embedder(backend)
    lexical_indexes["france_fiscalite_ir"] = index_country(
        client, embedder_france, france_articles, "france", "fiscalite_ir"
    )
    embedders["france_fiscalite_ir"] = embedder_france

    return client, embedders, lexical_indexes

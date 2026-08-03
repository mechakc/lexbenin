"""
CLI de test du pipeline RAG.

Usage:
    python3 -m rag.test_cli

Construit l'index (Bénin + France) puis lance une série de questions de test
pour vérifier que la recherche scopée par pays remonte les bons articles.
"""

import sys
sys.path.insert(0, ".")

from rag.pipeline import build_index, search


TEST_QUESTIONS = [
    ("benin", "droit_numerique", "Mes données personnelles sont-elles protégées si je m'inscris sur un site ?"),
    ("benin", "droit_numerique", "Que risque quelqu'un qui accède à mon ordinateur sans autorisation ?"),
    ("benin", "droit_numerique", "Ai-je le droit d'accéder librement à internet ?"),
    ("france", "fiscalite_ir", "Comment est calculé le taux de prélèvement à la source ?"),
    ("france", "fiscalite_ir", "Je fais un don à une association, ai-je une réduction d'impôt ?"),
    ("france", "fiscalite_ir", "Quel est le barème de l'impôt sur le revenu ?"),
]


def main():
    print("=" * 70)
    print("Construction de l'index (backend TF-IDF -- test local uniquement)")
    print("=" * 70)
    client, embedders, lexical_indexes = build_index(backend="tfidf")

    print("\n" + "=" * 70)
    print("Tests de recherche (hybride : vectoriel + lexical BM25, fusion RRF)")
    print("=" * 70)

    for pays, domaine, question in TEST_QUESTIONS:
        collection_key = f"{pays}_{domaine}"
        embedder = embedders[collection_key]
        lexical_index = lexical_indexes[collection_key]

        print(f"\n--- [{pays.upper()}] {question}")
        hits, best_vector_distance, lexically_grounded = search(
            client, embedder, lexical_index, pays, domaine, question, top_k=3
        )
        print(f"    (meilleure distance vectorielle brute : {best_vector_distance:.3f}, "
              f"ancrage lexical fort : {lexically_grounded})")
        for rank, hit in enumerate(hits, 1):
            meta = hit["metadata"]
            apercu = hit["texte"][:120].replace("\n", " ")
            print(f"  {rank}. Article {meta['numero_article']} (distance={hit['distance']:.3f})")
            print(f"     {apercu}...")


if __name__ == "__main__":
    main()

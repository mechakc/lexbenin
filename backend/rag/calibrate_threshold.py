"""
Calibration du distance_threshold utilisé dans rag/ask.py.

Objectif : trouver la valeur de distance qui sépare "question dans le périmètre"
de "question hors périmètre", sur TON backend d'embeddings réel (mistral-embed
en production -- voir rag/embeddings.py::MistralEmbedder).
Un seuil calibré sur un backend ne vaut RIEN sur un autre -- les échelles de
distance sont différentes (TF-IDF, e5, mistral-embed = 3 échelles distinctes).

Usage (depuis la racine du projet, MISTRAL_API_KEY définie dans l'environnement) :
    python3 -m rag.calibrate_threshold
"""

import sys
sys.path.insert(0, ".")

from rag.pipeline import build_index, search


# Questions clairement DANS le périmètre (droit numérique béninois)
QUESTIONS_PERTINENTES = [
    ("benin", "droit_numerique", "Mes données personnelles sont-elles protégées si je m'inscris sur un site ?"),
    ("benin", "droit_numerique", "Que risque quelqu'un qui accède à mon ordinateur sans autorisation ?"),
    ("benin", "droit_numerique", "Ai-je le droit d'accéder librement à internet ?"),
    ("benin", "droit_numerique", "Puis-je me faire rembourser un achat en ligne ?"),
]

# Questions clairement HORS périmètre (autres domaines de droit, ou hors-sujet)
QUESTIONS_HORS_SUJET = [
    ("benin", "droit_numerique", "Si je vole du pain à la boulangerie, je risque quoi ?"),
    ("benin", "droit_numerique", "Comment fonctionne le mariage coutumier au Bénin ?"),
    ("benin", "droit_numerique", "Quelle est la meilleure recette de sauce arachide ?"),
    ("benin", "droit_numerique", "Mon voisin a construit un mur sur mon terrain, que faire ?"),
]


def main():
    print("Construction de l'index (backend mistral)...")
    client, embedders, lexical_indexes = build_index(backend="mistral")

    print("\n=== Questions PERTINENTES (le distance devrait être BASSE) ===")
    distances_pertinentes = []
    for pays, domaine, question in QUESTIONS_PERTINENTES:
        embedder = embedders[f"{pays}_{domaine}"]
        lexical_index = lexical_indexes[f"{pays}_{domaine}"]
        _hits, d, _grounded = search(client, embedder, lexical_index, pays, domaine, question, top_k=1)
        distances_pertinentes.append(d)
        print(f"  {d:.3f}  -- {question}")

    print("\n=== Questions HORS SUJET (le distance devrait être ÉLEVÉE) ===")
    distances_hors_sujet = []
    for pays, domaine, question in QUESTIONS_HORS_SUJET:
        embedder = embedders[f"{pays}_{domaine}"]
        lexical_index = lexical_indexes[f"{pays}_{domaine}"]
        _hits, d, _grounded = search(client, embedder, lexical_index, pays, domaine, question, top_k=1)
        distances_hors_sujet.append(d)
        print(f"  {d:.3f}  -- {question}")

    print("\n=== Analyse ===")
    max_pertinente = max(distances_pertinentes)
    min_hors_sujet = min(distances_hors_sujet)
    print(f"Distance max parmi les questions pertinentes : {max_pertinente:.3f}")
    print(f"Distance min parmi les questions hors sujet   : {min_hors_sujet:.3f}")

    if max_pertinente < min_hors_sujet:
        seuil_suggere = (max_pertinente + min_hors_sujet) / 2
        print(f"\n✅ Bonne séparation. Seuil suggéré : distance_threshold = {seuil_suggere:.3f}")
    else:
        print(
            "\n⚠️  Chevauchement entre les deux groupes -- pas de seuil parfait. "
            "Prends une valeur proche de la distance max pertinente, quitte à laisser "
            "passer quelques questions limites plutôt que d'en rejeter des valides."
        )
        print(f"Suggestion prudente : distance_threshold = {max_pertinente + 0.05:.3f}")


if __name__ == "__main__":
    main()

"""
Tests unitaires du pipeline RAG — fonctions pures + un test d'intégration
hors-périmètre 100 % local (backend TF-IDF + MockGenerator, aucun appel réseau,
aucune clé API).

Lancer depuis le dossier backend/ (les chemins de données sont relatifs) :
    cd backend && python -m pytest
"""

import sys
from pathlib import Path

# Permet `import rag...` quel que soit le CWD, mais les tests qui construisent
# l'index doivent tout de même tourner depuis backend/ (données en chemin relatif).
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest

from rag.lexical import tokenize, reciprocal_rank_fusion, LexicalIndex


# --- tokenize -------------------------------------------------------------

def test_tokenize_minuscule_et_sans_accents():
    assert tokenize("Accès Illégal") == ["acces", "illegal"]


def test_tokenize_filtre_mots_trop_courts():
    # Les tokens de moins de 2 caractères sont écartés ("à", "a", ponctuation).
    assert tokenize("a à def") == ["def"]


def test_tokenize_garde_les_chiffres():
    assert tokenize("article 13") == ["article", "13"]


# --- reciprocal_rank_fusion ----------------------------------------------

def test_rrf_consensus_bat_premier_isole():
    # doc "b" est 2e dans les deux listes ; doc "a" est 1er dans une seule.
    # Le consensus (présent partout) doit l'emporter sur le vote fort isolé.
    vectoriel = ["a", "b", "c"]
    lexical = ["d", "b", "e"]
    scores = reciprocal_rank_fusion([vectoriel, lexical])
    assert scores["b"] > scores["a"]
    assert scores["b"] > scores["d"]


def test_rrf_liste_unique_preserve_ordre():
    # Avec une seule liste, RRF équivaut au classement d'origine (score décroissant).
    scores = reciprocal_rank_fusion([["x", "y", "z"]])
    assert scores["x"] > scores["y"] > scores["z"]


# --- LexicalIndex : tolérance aux fautes par préfixe ----------------------

def test_index_lexical_trouve_terme_exact():
    idx = LexicalIndex(
        ids=["art1", "art2"],
        texts=["protection des données personnelles", "accès illégal à un système"],
    )
    hits = idx.search("données personnelles", top_k=2)
    assert hits[0][0] == "art1"


def test_index_lexical_tolere_anglicisme_par_prefixe():
    # "access" (anglicisme) absent du corpus doit retomber sur "acces" (préfixe
    # de 5 caractères partagé) présent après suppression des accents.
    idx = LexicalIndex(
        ids=["art1", "art2"],
        texts=["protection des données personnelles", "accès illégal à un système"],
    )
    hits = idx.search("access illegal", top_k=2)
    assert hits, "la requête anglicisée devrait quand même remonter un article"
    assert hits[0][0] == "art2"


def test_index_lexical_filtre_le_bruit():
    # Une requête sans aucun recouvrement lexical ne doit rien remonter
    # (score BM25 nul -> filtré, pour ne pas polluer la fusion RRF).
    idx = LexicalIndex(ids=["art1"], texts=["protection des données personnelles"])
    assert idx.search("recette sauce arachide") == []


# --- Intégration : garde-fou hors-périmètre (local, sans réseau) ----------

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
_data_present = (DATA_DIR / "benin" / "articles_benin.json").exists()


@pytest.mark.skipif(
    not _data_present,
    reason="données absentes ou pytest lancé hors de backend/ (chemins relatifs)",
)
def test_ask_rejette_hors_perimetre_et_accepte_pertinent(monkeypatch):
    # Doit tourner depuis backend/ : build_index lit ./data/... en relatif.
    monkeypatch.chdir(DATA_DIR.parent)

    from rag.pipeline import build_index
    from rag.llm import MockGenerator
    from rag.ask import ask

    client, embedders, lexical_indexes = build_index(backend="tfidf")
    key = "benin_droit_numerique"
    generator = MockGenerator()

    common = dict(
        client=client,
        embedder=embedders[key],
        lexical_index=lexical_indexes[key],
        generator=generator,
        pays="benin",
        domaine="droit_numerique",
    )

    # Question clairement pertinente : doit produire des sources.
    pertinent = ask(
        **common,
        question="Mes données personnelles sont-elles protégées ?",
        distance_threshold=0.9,
    )
    assert pertinent["sources"], "une question dans le périmètre devrait citer des articles"

    # Question clairement hors sujet avec un seuil strict : doit être rejetée
    # (aucune source, message hors-périmètre).
    hors_sujet = ask(
        **common,
        question="Quelle est la meilleure recette de sauce arachide ?",
        distance_threshold=0.5,
    )
    assert hors_sujet["sources"] == []
    assert "périmètre" in hors_sujet["reponse"].lower()

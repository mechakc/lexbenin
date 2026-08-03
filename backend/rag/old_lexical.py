"""
Recherche lexicale (BM25) -- complément à la recherche vectorielle de pipeline.py.

Pourquoi : la recherche vectorielle seule capture bien le sens ("accès non
autorisé" ~ "piratage") mais peut manquer des correspondances exactes
importantes en droit (numéro d'article précis, terme juridique rare, sigle).
BM25 capture ces correspondances lexicales exactes, pondérées par la rareté
du terme (un mot rare qui matche compte plus qu'un mot courant).

À notre échelle (quelques centaines d'articles par pays), un index BM25 en
mémoire pur Python (rank_bm25) suffit largement -- pas besoin d'un moteur de
recherche dédié (Elasticsearch, PostgreSQL full-text, etc.).

Les deux résultats (vectoriel + lexical) sont ensuite fusionnés par Reciprocal
Rank Fusion (RRF) dans pipeline.py::search -- technique décrite par Cormack,
Clarke & Büttcher (SIGIR 2009), et utilisée par exemple par Cerebras dans leur
propre base de connaissances interne.
"""

import re
import unicodedata
from rank_bm25 import BM25Okapi


def _strip_accents(text: str) -> str:
    """Retire les accents (é -> e, ç -> c, etc.) -- indispensable en français
    car beaucoup d'utilisateurs tapent sans accents (clavier, habitude, mobile).
    Sans ça, une requête "acces illegal" ne matcherait jamais le texte "accès
    illégal" en recherche lexicale exacte."""
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(c for c in normalized if not unicodedata.combining(c))


def tokenize(text: str) -> list[str]:
    """Tokenisation simple : accents retirés, minuscules, mots de 2+ caractères.
    Volontairement basique -- pas de stemming/lemmatisation, BM25 reste efficace
    avec une tokenisation simple sur un corpus de cette taille."""
    text = _strip_accents(text.lower())
    return re.findall(r"[a-z0-9]{2,}", text)


class LexicalIndex:
    """Index BM25 en mémoire pour une collection (un pays/domaine)."""

    def __init__(self, ids: list[str], texts: list[str]):
        self.ids = ids
        tokenized_corpus = [tokenize(t) for t in texts]
        self.bm25 = BM25Okapi(tokenized_corpus)

    def search(self, query: str, top_k: int = 10) -> list[tuple[str, float]]:
        """Retourne les top_k (id, score) triés par score décroissant.
        Filtre les scores nuls/quasi nuls -- un score de 0 signifie aucun
        recouvrement lexical, ça ne doit pas polluer la fusion RRF avec du
        bruit (des documents qui n'ont strictement rien à voir)."""
        tokenized_query = tokenize(query)
        if not tokenized_query:
            return []
        scores = self.bm25.get_scores(tokenized_query)
        ranked = sorted(zip(self.ids, scores), key=lambda x: -x[1])
        return [(doc_id, score) for doc_id, score in ranked[:top_k] if score > 0.01]


def build_lexical_index(articles: list[dict]) -> LexicalIndex:
    """Construit un index BM25 à partir des mêmes articles que l'index vectoriel."""
    ids = [a["id"] for a in articles]
    texts = [a["texte_pour_embedding"] for a in articles]
    return LexicalIndex(ids, texts)


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]], k: int = 60
) -> dict[str, float]:
    """Fusionne plusieurs listes classées (résultats de différents moteurs de
    recherche) en un score unique par document, via Reciprocal Rank Fusion.

    score(doc) = somme, sur chaque liste où le document apparaît, de 1/(k+rang)

    La constante k=60 (valeur standard de la littérature, reprise par Cerebras)
    fait qu'un document bien classé dans PLUSIEURS listes bat un document
    classé 1er dans une seule liste -- le consensus compte plus qu'un vote fort
    isolé, ce qui limite justement le risque qu'un match purement vectoriel
    fortuit (sans aucune ancre lexicale) domine le classement final."""
    scores: dict[str, float] = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return scores

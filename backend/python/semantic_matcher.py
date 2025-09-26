from typing import List, Tuple, Dict
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors

class SymptomToSpecialistMatcher:
    def __init__(self, kb_csv: str, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        self.kb = pd.read_csv(kb_csv)
        # Basic sanity
        required = {"phrase", "specialist", "weight"}
        if not required.issubset(set(self.kb.columns)):
            raise ValueError(f"KB must have columns: {required}")
        self.kb["phrase"] = self.kb["phrase"].astype(str).str.strip()
        self.kb["specialist"] = self.kb["specialist"].astype(str).str.strip()
        self.kb["weight"] = self.kb["weight"].astype(float).clip(lower=0.1, upper=1.0)

        self.model = SentenceTransformer(model_name)
        self._build_index()

    def _normalize(self, X: np.ndarray) -> np.ndarray:
        # Cosine similarity via dot-product on unit vectors
        norms = np.linalg.norm(X, axis=1, keepdims=True) + 1e-12
        return X / norms

    def _build_index(self):
        phrases = self.kb["phrase"].tolist()
        self.kb_embeddings = self._normalize(self.model.encode(phrases, convert_to_numpy=True, show_progress_bar=False))
        self.nn = NearestNeighbors(n_neighbors=min(10, len(phrases)), algorithm="auto", metric="cosine")
        self.nn.fit(self.kb_embeddings)

    def match(self, user_text: str, top_k: int = 5, min_conf: float = 0.35) -> Dict:
        # Embed user text
        q_vec = self._normalize(self.model.encode([user_text], convert_to_numpy=True, show_progress_bar=False))[0]

        # Find nearest phrases
        distances, indices = self.nn.kneighbors([q_vec], n_neighbors=top_k, return_distance=True)
        distances, indices = distances[0], indices[0]  # shape: (top_k,)

        # Convert cosine distance -> similarity
        sims = 1.0 - distances  # in [0..1]
        rows = self.kb.iloc[indices].copy()
        rows["sim"] = sims
        rows["score"] = rows["sim"] * rows["weight"]

        # Aggregate by specialist
        agg = rows.groupby("specialist")["score"].sum().sort_values(ascending=False)
        best_specialist = agg.index[0]
        best_score = float(agg.iloc[0])

        # Normalize scores to [0..1] for readability
        total = agg.sum()
        confs = (agg / (total + 1e-12)).to_dict()

        # Pick top 2 suggestions if useful
        top_suggestions = [{"specialist": s, "confidence": float(confs[s])} for s in agg.index[:2]]

        # Fallback logic
        fallback = None
        if best_score < min_conf:
            fallback = "General Physician"
            if fallback not in [s["specialist"] for s in top_suggestions]:
                top_suggestions.append({"specialist": fallback, "confidence": 0.25})

        # Optional clarifying question when low confidence
        clarifying_q = None
        if best_score < min_conf:
            clarifying_q = "Do you also have fever, breathlessness, or chest tightness?"

        return {
            "matches": rows[["phrase", "specialist", "sim", "score"]].to_dict(orient="records"),
            "recommendations": top_suggestions,
            "primary": best_specialist if best_score >= min_conf else fallback or best_specialist,
            "primary_score": best_score,
            "needs_clarification": best_score < min_conf,
            "clarifying_question": clarifying_q
        }

if __name__ == "__main__":
    matcher = SymptomToSpecialistMatcher("data/kb_csv.csv")
    print(matcher.match("pain in my chest when running"))
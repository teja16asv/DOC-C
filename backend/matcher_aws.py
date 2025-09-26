import boto3
import pandas as pd
from difflib import get_close_matches
import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")

class Matcher:
    def __init__(self, kb_csv, region=AWS_REGION):
        self.kb = pd.read_csv(kb_csv)
        self.kb["phrase"] = self.kb["phrase"].astype(str).str.strip()
        self.kb["specialist"] = self.kb["specialist"].astype(str).str.strip()
        self.kb["weight"] = self.kb["weight"].astype(float).clip(lower=0.1, upper=1.0)

        self.cm = boto3.client("comprehendmedical", region_name=region)

    def match(self, text, top_k=3):
        try:
            response = self.cm.detect_entities_v2(Text=text)
            entities = [e["Text"] for e in response.get("Entities", [])
                        if e["Category"] == "MEDICAL_CONDITION"]
        except Exception as e:
            print("Comprehend error:", e)
            entities = []

        if not entities:
            return {
                "primary": "General Physician",
                "recommendations": [{"specialist": "General Physician", "confidence": 0.5}],
                "clarifying_question": "Please describe your symptoms in more detail."
            }

        matches = []
        for entity in entities:
            kb_match = get_close_matches(entity, self.kb["phrase"].tolist(), n=1, cutoff=0.5)
            if kb_match:
                row = self.kb[self.kb["phrase"] == kb_match[0]].iloc[0]
                matches.append((row["specialist"], row["weight"]))

        if not matches:
            return {
                "primary": "General Physician",
                "recommendations": [{"specialist": "General Physician", "confidence": 0.5}],
                "clarifying_question": "Can you clarify other symptoms?"
            }

        # Aggregate scores
        scores = {}
        for spec, score in matches:
            scores[spec] = scores.get(spec, 0) + score

        total = sum(scores.values())
        recs = [{"specialist": s, "confidence": round(scores[s]/total, 3)} 
                for s in sorted(scores, key=scores.get, reverse=True)]

        return {
            "primary": recs[0]["specialist"],
            "primary_score": recs[0]["confidence"],
            "recommendations": recs[:top_k],
            "clarifying_question": None if recs[0]["confidence"] >= 0.4 else "Do you have other symptoms?"
        }

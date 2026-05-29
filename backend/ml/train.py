import json
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

def train():
    print("🤖 Training ProCourse Adaptive Learning Model...")

    # ── Load training data ─────────────────────────────
    data_path = os.path.join(os.path.dirname(__file__), "training_data.json")
    with open(data_path, "r") as f:
        records = json.load(f)

    print(f"✓ Loaded {len(records)} interaction records")

    # ── Augment data for better training ──────────────
    # Generate more synthetic samples based on the rules
    augmented = []
    np.random.seed(42)

    # Struggling: score < 50
    for _ in range(200):
        score        = np.random.randint(0, 50)
        time_spent   = np.random.randint(30, 600)
        access_count = np.random.randint(1, 4)
        augmented.append({
            "time_spent": time_spent,
            "access_count": access_count,
            "score": score,
            "state": "struggling"
        })

    # Needs practice: score 50-70
    for _ in range(200):
        score        = np.random.randint(50, 70)
        time_spent   = np.random.randint(300, 1800)
        access_count = np.random.randint(2, 6)
        augmented.append({
            "time_spent": time_spent,
            "access_count": access_count,
            "score": score,
            "state": "needs_practice"
        })

    # Proficient: score >= 70
    for _ in range(200):
        score        = np.random.randint(70, 101)
        time_spent   = np.random.randint(600, 3600)
        access_count = np.random.randint(1, 5)
        augmented.append({
            "time_spent": time_spent,
            "access_count": access_count,
            "score": score,
            "state": "proficient"
        })

    all_data = records + augmented
    print(f"✓ Total training samples (with augmentation): {len(all_data)}")

    # ── Prepare features and labels ────────────────────
    X = np.array([
        [
            r["time_spent"],
            r["access_count"],
            r["score"],
            # Derived features
            r["score"] * r["access_count"],          # engagement score
            r["time_spent"] / max(r["access_count"], 1),  # avg time per access
        ]
        for r in all_data
    ])

    y_raw = [r["state"] for r in all_data]

    # Encode labels
    le = LabelEncoder()
    y  = le.fit_transform(y_raw)

    print(f"✓ Classes: {list(le.classes_)}")

    # ── Train/test split ───────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # ── Train Random Forest ────────────────────────────
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    # ── Evaluate ───────────────────────────────────────
    y_pred   = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n📊 Model Evaluation:")
    print(f"   Accuracy: {accuracy * 100:.1f}%")
    print(f"\n{classification_report(y_test, y_pred, target_names=le.classes_)}")

    # ── Feature importance ────────────────────────────
    feature_names = [
        "time_spent", "access_count", "score",
        "engagement_score", "avg_time_per_access"
    ]
    importances = model.feature_importances_
    print("📌 Feature Importances:")
    for name, imp in sorted(zip(feature_names, importances), key=lambda x: -x[1]):
        print(f"   {name}: {imp:.3f}")

    # ── Save model and encoder ─────────────────────────
    model_dir = os.path.dirname(__file__)
    model_path   = os.path.join(model_dir, "model.pkl")
    encoder_path = os.path.join(model_dir, "label_encoder.pkl")

    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    with open(encoder_path, "wb") as f:
        pickle.dump(le, f)

    print(f"\n✅ Model saved to ml/model.pkl")
    print(f"✅ Label encoder saved to ml/label_encoder.pkl")

    return accuracy

if __name__ == "__main__":
    accuracy = train()
    print(f"\n🎯 Final accuracy: {accuracy * 100:.1f}%")
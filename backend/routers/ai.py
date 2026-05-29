from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Module, Progress, User
from routers.auth import get_current_user
import joblib
import numpy as np

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Load ML model
try:
    model = joblib.load("ml/model.pkl")
    label_encoder = joblib.load("ml/label_encoder.pkl")
    ML_AVAILABLE = True
except:
    ML_AVAILABLE = False


@router.post("/predict")
def predict(
    module_id: int,
    time_spent: int,
    access_count: int,
    score: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Predict learning state based on interaction data.
    """
    if not ML_AVAILABLE:
        return {
            "learning_state": "needs_practice",
            "next_level": "intermediate",
            "message": "ML model not available, using fallback logic"
        }

    engagement_score = min(100, (access_count * 10) + (time_spent / 60))
    avg_time_per_access = time_spent / access_count if access_count > 0 else 0

    try:
        features = np.array([[
            time_spent,
            access_count,
            score,
            engagement_score,
            avg_time_per_access
        ]])
        prediction = model.predict(features)[0]
        learning_state = label_encoder.inverse_transform([prediction])[0]

        level_map = {
            "struggling": "foundational",
            "needs_practice": "intermediate",
            "proficient": "advanced"
        }
        next_level = level_map.get(learning_state, "intermediate")

        return {
            "learning_state": learning_state,
            "next_level": next_level,
            "confidence": "high"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/recommendation/{module_id}")
def get_recommendation(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get AI recommendation for next content level based on student's progress.
    """
    progress = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.module_id == module_id
    ).first()

    if not progress:
        return {
            "recommended_level": "intermediate",
            "reason": "No progress history found, starting at intermediate level"
        }

    return {
        "recommended_level": progress.current_level,
        "learning_state": progress.learning_state,
        "reason": f"Based on your {progress.learning_state} performance"
    }
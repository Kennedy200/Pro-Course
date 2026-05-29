from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Module, Quiz, Question, QuizAttempt, Progress, User
from routers.auth import get_current_user
import joblib
import numpy as np

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])

# Load ML model
try:
    model = joblib.load("ml/model.pkl")
    label_encoder = joblib.load("ml/label_encoder.pkl")
    ML_AVAILABLE = True
except:
    ML_AVAILABLE = False


@router.get("/{module_id}")
def get_quiz(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get quiz questions for a module."""
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No quiz for this module")

    questions = db.query(Question).filter(Question.quiz_id == quiz.id).all()

    return {
        "quiz_id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "text": q.text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
            }
            for q in questions
        ]
    }


@router.post("/{module_id}/submit")
def submit_quiz(
    module_id: int,
    answers: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit quiz answers and get AI-powered results."""
    
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(Question).filter(Question.quiz_id == quiz.id).all()

    # Grade quiz
    correct = 0
    total = len(questions)
    review = []

    for q in questions:
        user_answer = answers.get(str(q.id), "")
        is_correct = user_answer.upper() == q.correct_option.upper()
        if is_correct:
            correct += 1

        review.append({
            "question_id": q.id,
            "text": q.text,
            "your_answer": user_answer.upper() if user_answer else "NOT ANSWERED",
            "correct": q.correct_option.upper(),
            "is_correct": is_correct,
            "explanation": q.explanation,
        })

    percentage = round((correct / total) * 100) if total > 0 else 0

    # Get or create progress record
    progress = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.module_id == module_id
    ).first()

    if not progress:
        progress = Progress(
            student_id=current_user.id,
            module_id=module_id,
            current_level="intermediate",
            time_spent=0,
            access_count=1
        )
        db.add(progress)
        db.flush()

    # Extract features for ML
    time_spent = progress.time_spent
    access_count = progress.access_count
    engagement_score = min(100, (access_count * 10) + (time_spent / 60))
    avg_time_per_access = time_spent / access_count if access_count > 0 else 0

    # Predict learning state using ML
    learning_state = "needs_practice"
    next_level = "intermediate"
    ai_used = False

    if ML_AVAILABLE:
        try:
            features = np.array([[
                time_spent,
                access_count,
                percentage,
                engagement_score,
                avg_time_per_access
            ]])
            prediction = model.predict(features)[0]
            learning_state = label_encoder.inverse_transform([prediction])[0]
            ai_used = True
        except Exception as e:
            print(f"ML prediction failed: {e}")

    # Fallback logic if ML fails
    if not ai_used:
        if percentage >= 80:
            learning_state = "proficient"
        elif percentage >= 50:
            learning_state = "needs_practice"
        else:
            learning_state = "struggling"

    # Determine next level
    level_map = {
        "struggling": "foundational",
        "needs_practice": "intermediate",
        "proficient": "advanced"
    }
    next_level = level_map.get(learning_state, "intermediate")

    # Update progress
    progress.learning_state = learning_state
    progress.current_level = next_level

    # Mark as completed if proficient
    if learning_state == "proficient":
        progress.is_completed = True

    # Save quiz attempt with correct fields
    attempt = QuizAttempt(
        student_id=current_user.id,
        quiz_id=quiz.id,
        score=correct,
        percentage=percentage,
        total=total,
        learning_state=learning_state
    )
    db.add(attempt)
    db.commit()

    # Generate message
    messages = {
        "proficient": f"Excellent work! You've mastered this content with {percentage}%. Moving to advanced material.",
        "needs_practice": f"Good effort! You scored {percentage}%. Review the content and try again to improve.",
        "struggling": f"You scored {percentage}%. Let's revisit the fundamentals to build a stronger foundation."
    }

    return {
        "score": correct,
        "total": total,
        "percentage": percentage,
        "learning_state": learning_state,
        "next_level": next_level,
        "message": messages.get(learning_state, "Quiz completed."),
        "ai_used": ai_used,
        "review": review
    }
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import (
    Progress, Course, Module, Enrollment,
    QuizAttempt, Quiz, User
)
from routers.auth import get_current_user
from sqlalchemy import func

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("/student")
def get_student_progress(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.is_active  == True,
    ).all()

    courses_progress = []
    total_modules_completed = 0
    total_time_spent        = 0
    all_scores              = []

    for enrollment in enrollments:
        course  = db.query(Course).filter(Course.id == enrollment.course_id).first()
        modules = db.query(Module).filter(
            Module.course_id == course.id
        ).order_by(Module.order).all()

        completed = 0
        course_scores = []

        for module in modules:
            prog = db.query(Progress).filter(
                Progress.student_id == current_user.id,
                Progress.module_id  == module.id,
            ).first()

            if prog:
                total_time_spent += prog.time_spent
                if prog.is_completed:
                    completed += 1
                    total_modules_completed += 1

            quiz = db.query(Quiz).filter(Quiz.module_id == module.id).first()
            if quiz:
                attempt = db.query(QuizAttempt).filter(
                    QuizAttempt.student_id == current_user.id,
                    QuizAttempt.quiz_id    == quiz.id,
                ).order_by(QuizAttempt.attempted_at.desc()).first()
                if attempt:
                    course_scores.append(attempt.percentage)
                    all_scores.append(attempt.percentage)

        total    = len(modules)
        avg_score = round(sum(course_scores) / len(course_scores), 1) if course_scores else 0

        courses_progress.append({
            "course_id":   course.id,
            "course_title": course.title,
            "course_code":  course.code,
            "total_modules":     total,
            "completed_modules": completed,
            "progress":    round((completed / total) * 100) if total > 0 else 0,
            "avg_score":   avg_score,
            "status":      "completed" if completed == total else "in_progress" if completed > 0 else "not_started",
        })

    # Learning state distribution
    all_progress = db.query(Progress).filter(
        Progress.student_id == current_user.id
    ).all()

    state_counts = {"proficient": 0, "needs_practice": 0, "struggling": 0}
    for p in all_progress:
        if p.learning_state and p.learning_state.value in state_counts:
            state_counts[p.learning_state.value] += 1

    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0

    return {
        "summary": {
            "total_courses":    len(enrollments),
            "modules_completed": total_modules_completed,
            "avg_score":        avg_score,
            "hours_studied": round(total_time_spent / 60),
            "total_quizzes":    len(all_scores),
        },
        "learning_states":  state_counts,
        "courses_progress": courses_progress,
    }


@router.get("/student/activity")
def get_recent_activity(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.student_id == current_user.id
    ).order_by(QuizAttempt.attempted_at.desc()).limit(10).all()

    activity = []
    for attempt in attempts:
        quiz   = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
        module = db.query(Module).filter(Module.id == quiz.module_id).first() if quiz else None

        activity.append({
            "type":       "quiz_attempt",
            "text":       f"Scored {attempt.percentage:.0f}% on {module.title if module else 'Unknown'} quiz",
            "score":      attempt.percentage,
            "state":      attempt.learning_state.value,
            "timestamp":  attempt.attempted_at.isoformat(),
        })

    return {"activity": activity}
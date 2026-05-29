from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Course, Module, Enrollment, Progress, User
from routers.auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/")
def get_all_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.is_active == True).all()
    result = []
    for c in courses:
        modules = db.query(Module).filter(Module.course_id == c.id).order_by(Module.order).all()
        result.append({
            "id":          c.id,
            "title":       c.title,
            "code":        c.code,
            "description": c.description,
            "level":       c.level,
            "duration":    c.duration,
            "total_modules": len(modules),
        })
    return result


@router.get("/enrolled")
def get_enrolled_courses(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.is_active  == True,
    ).all()

    result = []
    for enrollment in enrollments:
        course  = db.query(Course).filter(Course.id == enrollment.course_id).first()
        modules = db.query(Module).filter(Module.course_id == course.id).order_by(Module.order).all()

        # Calculate progress
        total     = len(modules)
        completed = 0
        current_module_title = None

        for module in modules:
            prog = db.query(Progress).filter(
                Progress.student_id == current_user.id,
                Progress.module_id  == module.id,
            ).first()
            if prog and prog.is_completed:
                completed += 1
            elif prog and not prog.is_completed and current_module_title is None:
                current_module_title = f"Module {module.order}: {module.title}"

        if current_module_title is None and completed < total:
            first_incomplete = next(
                (m for m in modules if not db.query(Progress).filter(
                    Progress.student_id == current_user.id,
                    Progress.module_id  == m.id,
                ).first()),
                modules[0] if modules else None
            )
            if first_incomplete:
                current_module_title = f"Module {first_incomplete.order}: {first_incomplete.title}"

        progress_pct = round((completed / total) * 100) if total > 0 else 0
        status = "completed" if completed == total else "in_progress" if completed > 0 else "not_started"

        result.append({
            "id":             course.id,
            "title":          course.title,
            "code":           course.code,
            "description":    course.description,
            "level":          course.level,
            "duration":       course.duration,
            "total_modules":  total,
            "completed_modules": completed,
            "progress":       progress_pct,
            "current_module": current_module_title,
            "status":         status,
        })

    return result


@router.get("/{course_id}")
def get_course_detail(
    course_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    modules = db.query(Module).filter(
        Module.course_id == course_id
    ).order_by(Module.order).all()

    modules_data = []
    for module in modules:
        prog = db.query(Progress).filter(
            Progress.student_id == current_user.id,
            Progress.module_id  == module.id,
        ).first()

        # Determine status
        if prog and prog.is_completed:
            # Already completed
            status = "completed"
        elif module.order == 1:
            # First module is always active
            status = "active"
        else:
            # Check if previous module is completed
            prev_module = db.query(Module).filter(
                Module.course_id == course_id,
                Module.order     == module.order - 1,
            ).first()

            if prev_module:
                prev_prog = db.query(Progress).filter(
                    Progress.student_id   == current_user.id,
                    Progress.module_id    == prev_module.id,
                    Progress.is_completed == True,
                ).first()
                # Only active if previous module is completed
                status = "active" if prev_prog else "locked"
            else:
                status = "locked"

        modules_data.append({
            "id":             module.id,
            "order":          module.order,
            "title":          module.title,
            "status":         status,
            "learning_state": prog.learning_state.value if prog and prog.learning_state else None,
            "score":          None,
        })

    # Get latest quiz scores
    from models import QuizAttempt, Quiz
    for mod_data in modules_data:
        quiz = db.query(Quiz).filter(Quiz.module_id == mod_data["id"]).first()
        if quiz:
            attempt = db.query(QuizAttempt).filter(
                QuizAttempt.student_id == current_user.id,
                QuizAttempt.quiz_id    == quiz.id,
            ).order_by(QuizAttempt.attempted_at.desc()).first()
            if attempt:
                mod_data["score"] = attempt.percentage

    total     = len(modules)
    completed = sum(1 for m in modules_data if m["status"] == "completed")

    return {
        "id":                course.id,
        "title":             course.title,
        "code":              course.code,
        "description":       course.description,
        "level":             course.level,
        "duration":          course.duration,
        "total_modules":     total,
        "completed_modules": completed,
        "progress":          round((completed / total) * 100) if total > 0 else 0,
        "modules":           modules_data,
    }


@router.post("/{course_id}/enroll")
def enroll_in_course(
    course_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id  == course_id,
    ).first()

    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
        return {"message": "Already enrolled"}

    enrollment = Enrollment(
        student_id=current_user.id,
        course_id=course_id,
    )
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully"}
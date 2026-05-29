from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Course, Enrollment, Progress, QuizAttempt, Module, RoleEnum
from routers.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def require_lecturer(current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.lecturer and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Lecturer or admin access required")
    return current_user


def get_student_stats(student_id: int, db: Session):
    """
    Helper: compute accurate stats for one student.
    Uses LATEST attempt per quiz, not average of all attempts.
    """
    # Get all quizzes this student attempted
    all_attempts = db.query(QuizAttempt).filter(
        QuizAttempt.student_id == student_id
    ).all()

    # Group by quiz_id, keep only the LATEST attempt per quiz
    latest_per_quiz = {}
    for attempt in all_attempts:
        if attempt.quiz_id not in latest_per_quiz:
            latest_per_quiz[attempt.quiz_id] = attempt
        else:
            # Keep the one with higher id (most recent)
            if attempt.id > latest_per_quiz[attempt.quiz_id].id:
                latest_per_quiz[attempt.quiz_id] = attempt

    latest_attempts = list(latest_per_quiz.values())

    # Avg score from latest attempts only
    avg_score = round(
        sum(a.percentage for a in latest_attempts if a.percentage is not None) / len(latest_attempts)
    ) if latest_attempts else 0

    # Progress records
    progress_records = db.query(Progress).filter(
        Progress.student_id == student_id
    ).all()

    # Learning state from Progress records (already updated on latest quiz submit)
    state_counts = {"proficient": 0, "needs_practice": 0, "struggling": 0}
    for p in progress_records:
        if p.learning_state and p.learning_state.value in state_counts:
            state_counts[p.learning_state.value] += 1
        elif p.learning_state and str(p.learning_state) in state_counts:
            state_counts[str(p.learning_state)] += 1

    # Determine overall learning state from avg score of LATEST attempts
    if avg_score >= 80:
        learning_state = "proficient"
    elif avg_score >= 50:
        learning_state = "needs_practice"
    else:
        learning_state = "struggling"

    # Override: if all progress records are proficient, student is proficient
    total_progress = len(progress_records)
    proficient_progress = state_counts["proficient"]
    if total_progress > 0 and proficient_progress == total_progress:
        learning_state = "proficient"

    # At risk only if avg score < 50
    at_risk = avg_score < 50

    return {
        "avg_score": avg_score,
        "learning_state": learning_state,
        "at_risk": at_risk,
        "latest_attempts": latest_attempts,
        "progress_records": progress_records,
    }


@router.get("/overview")
def get_overview(db: Session = Depends(get_db), _: User = Depends(require_lecturer)):
    """Class-wide analytics overview."""

    total_students = db.query(User).filter(User.role == RoleEnum.student).count()
    total_courses = db.query(Course).filter(Course.is_active == True).count()

    students = db.query(User).filter(User.role == RoleEnum.student).all()

    # Completion rates
    completion_rates = []
    for student in students:
        enrollments = db.query(Enrollment).filter(
            Enrollment.student_id == student.id
        ).all()
        total_modules = 0
        completed_modules = 0

        for enrollment in enrollments:
            course_modules = db.query(Module).filter(
                Module.course_id == enrollment.course_id
            ).count()
            total_modules += course_modules

            completed = db.query(Progress).filter(
                Progress.student_id == student.id,
                Progress.module_id.in_(
                    db.query(Module.id).filter(Module.course_id == enrollment.course_id)
                ),
                Progress.is_completed == True
            ).count()
            completed_modules += completed

        if total_modules > 0:
            completion_rates.append((completed_modules / total_modules) * 100)

    avg_completion = round(
        sum(completion_rates) / len(completion_rates)
    ) if completion_rates else 0

    # Avg score using LATEST attempt per quiz per student
    all_latest_scores = []
    for student in students:
        stats = get_student_stats(student.id, db)
        for a in stats["latest_attempts"]:
            if a.percentage is not None:
                all_latest_scores.append(a.percentage)

    avg_score = round(
        sum(all_latest_scores) / len(all_latest_scores)
    ) if all_latest_scores else 0

    # Learning states — count UNIQUE STUDENTS per state (not modules)
    proficient_students = 0
    needs_practice_students = 0
    struggling_students = 0

    for student in students:
        stats = get_student_stats(student.id, db)
        state = stats["learning_state"]
        if state == "proficient":
            proficient_students += 1
        elif state == "needs_practice":
            needs_practice_students += 1
        else:
            struggling_students += 1

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "avg_completion": avg_completion,
        "avg_score": avg_score,
        "learning_states": {
            "proficient": proficient_students,
            "needs_practice": needs_practice_students,
            "struggling": struggling_students,
        }
    }


@router.get("/students")
def get_students(db: Session = Depends(get_db), _: User = Depends(require_lecturer)):
    """Get performance data for all students."""

    students = db.query(User).filter(User.role == RoleEnum.student).all()

    result = []
    for student in students:
        courses_enrolled = db.query(Enrollment).filter(
            Enrollment.student_id == student.id
        ).count()

        # Use helper for accurate stats
        stats = get_student_stats(student.id, db)

        # Total modules vs completed
        enrollments = db.query(Enrollment).filter(
            Enrollment.student_id == student.id
        ).all()
        total_modules = 0
        completed_modules = 0

        for enrollment in enrollments:
            course_modules = db.query(Module).filter(
                Module.course_id == enrollment.course_id
            ).count()
            total_modules += course_modules

            completed = db.query(Progress).filter(
                Progress.student_id == student.id,
                Progress.module_id.in_(
                    db.query(Module.id).filter(Module.course_id == enrollment.course_id)
                ),
                Progress.is_completed == True
            ).count()
            completed_modules += completed

        result.append({
            "student_id": student.id,
            "full_name": student.full_name,
            "email": student.email,
            "courses_enrolled": courses_enrolled,
            "avg_score": stats["avg_score"],
            "modules_completed": completed_modules,
            "total_modules": total_modules,
            "learning_state": stats["learning_state"],
            "at_risk": stats["at_risk"],
        })

    return result


@router.get("/courses/{course_id}")
def get_course_analytics(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_lecturer)
):
    """Get analytics for a specific course."""

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    students_enrolled = db.query(Enrollment).filter(
        Enrollment.course_id == course_id
    ).count()

    enrollments = db.query(Enrollment).filter(
        Enrollment.course_id == course_id
    ).all()
    completion_rates = []

    for enrollment in enrollments:
        course_modules = db.query(Module).filter(
            Module.course_id == course_id
        ).count()
        if course_modules > 0:
            completed = db.query(Progress).filter(
                Progress.student_id == enrollment.student_id,
                Progress.module_id.in_(
                    db.query(Module.id).filter(Module.course_id == course_id)
                ),
                Progress.is_completed == True
            ).count()
            completion_rates.append((completed / course_modules) * 100)

    avg_completion = round(
        sum(completion_rates) / len(completion_rates)
    ) if completion_rates else 0

    modules = db.query(Module).filter(
        Module.course_id == course_id
    ).order_by(Module.order).all()

    module_stats = []
    for module in modules:
        attempts_count = db.query(Progress).filter(
            Progress.module_id == module.id
        ).count()

        # Get latest attempt per student for this module's quiz
        from models import Quiz
        quiz = db.query(Quiz).filter(Quiz.module_id == module.id).first()

        avg_score = 0
        if quiz:
            # Get all students enrolled in this course
            enrolled_students = db.query(Enrollment.student_id).filter(
                Enrollment.course_id == course_id
            ).all()
            enrolled_ids = [s.student_id for s in enrolled_students]

            latest_scores = []
            for sid in enrolled_ids:
                # Latest attempt for this quiz by this student
                latest = db.query(QuizAttempt).filter(
                    QuizAttempt.student_id == sid,
                    QuizAttempt.quiz_id == quiz.id
                ).order_by(QuizAttempt.id.desc()).first()

                if latest and latest.percentage is not None:
                    latest_scores.append(latest.percentage)

            avg_score = round(
                sum(latest_scores) / len(latest_scores)
            ) if latest_scores else 0

        struggling = db.query(Progress).filter(
            Progress.module_id == module.id,
            Progress.learning_state == "struggling"
        ).count()

        module_stats.append({
            "module_id": module.id,
            "title": module.title,
            "order": module.order,
            "attempts": attempts_count,
            "avg_score": avg_score,
            "struggling_count": struggling,
        })

    return {
        "course": {
            "id": course.id,
            "title": course.title,
            "code": course.code,
        },
        "students_enrolled": students_enrolled,
        "avg_completion": avg_completion,
        "modules": module_stats,
    }
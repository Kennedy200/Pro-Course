from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Module, ModuleContent, Progress, User, LevelEnum
from routers.auth import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/api/modules", tags=["modules"])


@router.get("/{module_id}")
def get_module(
    module_id:    int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Get or create progress
    prog = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.module_id  == module_id,
    ).first()

    current_level = prog.current_level.value if prog else "intermediate"

    # Update access count and last accessed
    if prog:
        prog.access_count  += 1
        prog.last_accessed  = datetime.now(timezone.utc)
        db.commit()
    else:
        prog = Progress(
            student_id    = current_user.id,
            module_id     = module_id,
            current_level = LevelEnum.intermediate,
            access_count  = 1,
            last_accessed = datetime.now(timezone.utc),
        )
        db.add(prog)
        db.commit()

    # Get content for current level
    content = db.query(ModuleContent).filter(
        ModuleContent.module_id == module_id,
        ModuleContent.level     == LevelEnum(current_level),
    ).first()

    # Get all content levels available
    all_contents = db.query(ModuleContent).filter(
        ModuleContent.module_id == module_id,
    ).all()

    available_levels = [c.level.value for c in all_contents]

    from models import Quiz
    quiz = db.query(Quiz).filter(Quiz.module_id == module_id).first()

    return {
        "id":               module.id,
        "course_id":        module.course_id,
        "title":            module.title,
        "order":            module.order,
        "current_level":    current_level,
        "available_levels": available_levels,
        "content": {
            "title": content.title if content else "Content not available",
            "body":  content.body  if content else "",
        } if content else None,
        "progress": {
            "is_completed":  prog.is_completed,
            "learning_state": prog.learning_state.value if prog else "struggling",
            "time_spent":    prog.time_spent,
            "access_count":  prog.access_count,
        },
        "has_quiz": quiz is not None,
        "quiz_id":  quiz.id if quiz else None,
    }


@router.get("/{module_id}/content/{level}")
def get_module_content_by_level(
    module_id:    int,
    level:        str,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    try:
        level_enum = LevelEnum(level)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid level: {level}")

    content = db.query(ModuleContent).filter(
        ModuleContent.module_id == module_id,
        ModuleContent.level     == level_enum,
    ).first()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    # Update progress level
    prog = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.module_id  == module_id,
    ).first()
    if prog:
        prog.current_level = level_enum
        db.commit()

    return {
        "level": level,
        "title": content.title,
        "body":  content.body,
    }


@router.post("/{module_id}/track-time")
def track_time(
    module_id:    int,
    payload:      dict,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    seconds = payload.get("seconds", 0)

    prog = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.module_id  == module_id,
    ).first()

    if prog:
        prog.time_spent   += seconds
        prog.last_accessed = datetime.now(timezone.utc)
        db.commit()
        return {"time_spent": prog.time_spent}

    return {"time_spent": seconds}
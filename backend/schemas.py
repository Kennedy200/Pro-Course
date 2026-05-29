from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum
from datetime import datetime


class RoleEnum(str, Enum):
    student  = "student"
    lecturer = "lecturer"
    admin    = "admin"


class LevelEnum(str, Enum):
    foundational = "foundational"
    intermediate = "intermediate"
    advanced     = "advanced"


class StateEnum(str, Enum):
    struggling     = "struggling"
    needs_practice = "needs_practice"
    proficient     = "proficient"


# ── Auth ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    full_name:     str
    email:         EmailStr
    password:      str
    role:          RoleEnum = RoleEnum.student
    matric_number: Optional[str] = None


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str
    role:         str
    full_name:    str


class UserResponse(BaseModel):
    id:            int
    full_name:     str
    email:         str
    role:          str
    matric_number: Optional[str] = None
    created_at:    datetime

    class Config:
        from_attributes = True


# ── Courses ───────────────────────────────────────────
class CourseResponse(BaseModel):
    id:          int
    title:       str
    code:        str
    description: Optional[str]
    level:       str
    duration:    Optional[str]

    class Config:
        from_attributes = True


# ── Modules ───────────────────────────────────────────
class ModuleResponse(BaseModel):
    id:        int
    course_id: int
    title:     str
    order:     int

    class Config:
        from_attributes = True


# ── Content ───────────────────────────────────────────
class ContentResponse(BaseModel):
    id:        int
    module_id: int
    level:     str
    title:     str
    body:      str
    order:     int

    class Config:
        from_attributes = True


# ── Quiz ──────────────────────────────────────────────
class QuestionResponse(BaseModel):
    id:       int
    text:     str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id:        int
    module_id: int
    level:     str
    title:     str
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


class QuizSubmitRequest(BaseModel):
    quiz_id:  int
    answers:  dict


class QuizResultResponse(BaseModel):
    score:          float
    total:          int
    percentage:     float
    learning_state: str
    next_level:     str
    message:        str
    ai_prediction:  Optional[str] = None


# ── Progress ──────────────────────────────────────────
class ProgressResponse(BaseModel):
    id:             int
    module_id:      int
    current_level:  str
    learning_state: str
    is_completed:   bool
    time_spent:     int
    access_count:   int

    class Config:
        from_attributes = True


class UpdateProgressRequest(BaseModel):
    time_spent:   Optional[int] = None
    access_count: Optional[int] = None


# ── Analytics ─────────────────────────────────────────
class StudentAnalyticsResponse(BaseModel):
    student_id:        int
    full_name:         str
    email:             str
    modules_completed: int
    avg_score:         float
    learning_state:    str
    at_risk:           bool
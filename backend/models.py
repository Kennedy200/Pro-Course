from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    ForeignKey, DateTime, Text, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class RoleEnum(str, enum.Enum):
    student  = "student"
    lecturer = "lecturer"
    admin    = "admin"


class LevelEnum(str, enum.Enum):
    foundational   = "foundational"
    intermediate   = "intermediate"
    advanced       = "advanced"


class StateEnum(str, enum.Enum):
    struggling      = "struggling"
    needs_practice  = "needs_practice"
    proficient      = "proficient"


# ── Users ─────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String, nullable=False)
    email         = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role          = Column(Enum(RoleEnum), default=RoleEnum.student, nullable=False)
    matric_number = Column(String, nullable=True)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    enrollments   = relationship("Enrollment", back_populates="student")
    progress      = relationship("Progress", back_populates="student")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")


# ── Courses ───────────────────────────────────────────
class Course(Base):
    __tablename__ = "courses"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    code        = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    level       = Column(String, nullable=False)
    duration    = Column(String, nullable=True)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    modules     = relationship("Module", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course")


# ── Modules ───────────────────────────────────────────
class Module(Base):
    __tablename__ = "modules"

    id          = Column(Integer, primary_key=True, index=True)
    course_id   = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title       = Column(String, nullable=False)
    order       = Column(Integer, nullable=False)
    is_active   = Column(Boolean, default=True)

    course      = relationship("Course", back_populates="modules")
    contents    = relationship("ModuleContent", back_populates="module")
    quizzes     = relationship("Quiz", back_populates="module")
    progress    = relationship("Progress", back_populates="module")


# ── Module Content (3 tiers) ──────────────────────────
class ModuleContent(Base):
    __tablename__ = "module_contents"

    id         = Column(Integer, primary_key=True, index=True)
    module_id  = Column(Integer, ForeignKey("modules.id"), nullable=False)
    level      = Column(Enum(LevelEnum), nullable=False)
    title      = Column(String, nullable=False)
    body       = Column(Text, nullable=False)
    order      = Column(Integer, default=1)

    module     = relationship("Module", back_populates="contents")


# ── Quizzes ───────────────────────────────────────────
class Quiz(Base):
    __tablename__ = "quizzes"

    id         = Column(Integer, primary_key=True, index=True)
    module_id  = Column(Integer, ForeignKey("modules.id"), nullable=False)
    level      = Column(Enum(LevelEnum), nullable=False)
    title      = Column(String, nullable=False)

    module     = relationship("Module", back_populates="quizzes")
    questions  = relationship("Question", back_populates="quiz")
    attempts   = relationship("QuizAttempt", back_populates="quiz")


# ── Questions ─────────────────────────────────────────
class Question(Base):
    __tablename__ = "questions"

    id             = Column(Integer, primary_key=True, index=True)
    quiz_id        = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    text           = Column(Text, nullable=False)
    option_a       = Column(String, nullable=False)
    option_b       = Column(String, nullable=False)
    option_c       = Column(String, nullable=False)
    option_d       = Column(String, nullable=False)
    correct_option = Column(String, nullable=False)
    explanation    = Column(Text, nullable=True)

    quiz           = relationship("Quiz", back_populates="questions")


# ── Quiz Attempts ─────────────────────────────────────
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id      = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score        = Column(Float, nullable=False)
    total        = Column(Integer, nullable=False)
    percentage   = Column(Float, nullable=False)
    learning_state = Column(Enum(StateEnum), nullable=False)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())

    student      = relationship("User", back_populates="quiz_attempts")
    quiz         = relationship("Quiz", back_populates="attempts")


# ── Progress ──────────────────────────────────────────
class Progress(Base):
    __tablename__ = "progress"

    id               = Column(Integer, primary_key=True, index=True)
    student_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id        = Column(Integer, ForeignKey("modules.id"), nullable=False)
    current_level    = Column(Enum(LevelEnum), default=LevelEnum.foundational)
    learning_state   = Column(Enum(StateEnum), default=StateEnum.struggling)
    is_completed     = Column(Boolean, default=False)
    time_spent       = Column(Integer, default=0)
    access_count     = Column(Integer, default=0)
    last_accessed    = Column(DateTime(timezone=True), nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    student          = relationship("User", back_populates="progress")
    module           = relationship("Module", back_populates="progress")


# ── Enrollments ───────────────────────────────────────
class Enrollment(Base):
    __tablename__ = "enrollments"

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id    = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrolled_at  = Column(DateTime(timezone=True), server_default=func.now())
    is_active    = Column(Boolean, default=True)

    student      = relationship("User", back_populates="enrollments")
    course       = relationship("Course", back_populates="enrollments")
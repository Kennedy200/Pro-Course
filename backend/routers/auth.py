from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, RoleEnum, Course, Enrollment
from schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode("utf-8"), hashed.encode("utf-8")
    )


def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire    = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MIN)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str          = Depends(oauth2_scheme),
    db:    Session      = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# ── Register ───────────────────────────────────────────
@router.post("/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name     = payload.full_name,
        email         = payload.email,
        password_hash = hash_password(payload.password),
        role          = payload.role,
        matric_number = payload.matric_number,
    )
    db.add(user)
    db.flush()

    # Auto-enroll new students in all active courses
    if payload.role == "student":
        courses = db.query(Course).filter(Course.is_active == True).all()
        for course in courses:
            enrollment = Enrollment(
                student_id = user.id,
                course_id  = course.id,
            )
            db.add(enrollment)

    db.commit()
    db.refresh(user)
    return {"message": "Account created successfully"}


# ── Login ──────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "role":         user.role,
        "full_name":    user.full_name,
    }


# ── Me ─────────────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
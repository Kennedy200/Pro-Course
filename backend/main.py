from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, courses, modules, quizzes, progress, analytics, ai
import models

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProCourse API",
    description="Adaptive Learning Content Delivery System",
    version="1.0.0"
)

# CORS — must be added BEFORE routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(modules.router)
app.include_router(quizzes.router)
app.include_router(progress.router)
app.include_router(analytics.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "ProCourse API is running",
        "version": "1.0.0",
        "docs":    "/docs"
    }
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine, Base
from models import (
    User, Course, Module, ModuleContent, Quiz, Question,
    Enrollment, Progress, QuizAttempt, RoleEnum, LevelEnum
)
import bcrypt, json, random
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def clear_database():
    print("🗑️  Clearing existing data...")
    db.query(QuizAttempt).delete()
    db.query(Question).delete()
    db.query(Quiz).delete()
    db.query(Progress).delete()
    db.query(Enrollment).delete()
    db.query(ModuleContent).delete()
    db.query(Module).delete()
    db.query(Course).delete()
    db.query(User).delete()
    db.commit()

def create_admin_lecturer():
    print("👥 Creating admin and lecturer accounts...")
    
    admin = User(
        full_name="Admin User",
        email="admin@demo.com",
        password_hash=hash_password("demo1234"),
        role=RoleEnum.admin
    )
    db.add(admin)
    
    lecturer = User(
        full_name="Fish Loaves",
        email="lecturer@demo.com",
        password_hash=hash_password("demo1234"),
        role=RoleEnum.lecturer
    )
    db.add(lecturer)
    
    db.commit()
    print("  ✓ Admin: admin@demo.com / demo1234")
    print("  ✓ Lecturer: lecturer@demo.com / demo1234")

def create_courses():
    print("📚 Creating courses...")
    courses = [
        {"title": "Data Structures & Algorithms", "code": "CSC 301", "level": "200", "description": "Learn fundamental data structures and algorithm design patterns.", "duration": "12 weeks"},
        {"title": "Computer Networks", "code": "CSC 312", "level": "300", "description": "Study network protocols, architectures, and communication systems.", "duration": "12 weeks"},
        {"title": "Operating Systems", "code": "CSC 320", "level": "300", "description": "Explore OS concepts including processes, memory, and file systems.", "duration": "12 weeks"},
        {"title": "Software Engineering", "code": "CSC 340", "level": "400", "description": "Master software development methodologies and best practices.", "duration": "12 weeks"},
    ]
    
    for c in courses:
        course = Course(**c, is_active=True)
        db.add(course)
    
    db.commit()
    print("  ✓ 4 courses created")

def create_modules():
    print("📖 Creating modules...")
    
    # DSA modules
    dsa = db.query(Course).filter(Course.code == "CSC 301").first()
    dsa_modules = [
        "Introduction to DSA", "Arrays & Strings", "Linked Lists",
        "Stacks & Queues", "Trees & BST", "Hash Tables",
        "Graphs & Traversal", "Sorting & Searching"
    ]
    for i, title in enumerate(dsa_modules, 1):
        db.add(Module(course_id=dsa.id, title=title, order=i))
    
    # Networks modules
    net = db.query(Course).filter(Course.code == "CSC 312").first()
    net_modules = [
        "Network Fundamentals", "OSI Model", "TCP/IP Protocol Suite",
        "Routing & Switching", "Network Security", "Wireless Networks",
        "Network Management"
    ]
    for i, title in enumerate(net_modules, 1):
        db.add(Module(course_id=net.id, title=title, order=i))
    
    # OS modules
    os_course = db.query(Course).filter(Course.code == "CSC 320").first()
    os_modules = [
        "OS Overview", "Process Management", "CPU Scheduling",
        "Memory Management", "File Systems", "Concurrency",
        "Deadlock", "I/O Management", "Virtualization"
    ]
    for i, title in enumerate(os_modules, 1):
        db.add(Module(course_id=os_course.id, title=title, order=i))
    
    # SE modules
    se = db.query(Course).filter(Course.code == "CSC 340").first()
    se_modules = [
        "SDLC Models", "Requirements Analysis", "UML Design",
        "Testing Strategies", "Version Control", "Agile & Scrum"
    ]
    for i, title in enumerate(se_modules, 1):
        db.add(Module(course_id=se.id, title=title, order=i))
    
    db.commit()
    print("  ✓ 30 modules created")

def create_content_and_quizzes():
    print("📝 Creating content and quizzes (DSA + Networks only)...")
    
    # This creates full content for DSA and Networks
    # OS and SE content is added via patch_os_se.py
    
    modules = db.query(Module).join(Course).filter(
        Course.code.in_(["CSC 301", "CSC 312"])
    ).all()
    
    for module in modules:
        # Add 3-tier content
        for level in [LevelEnum.foundational, LevelEnum.intermediate, LevelEnum.advanced]:
            content = ModuleContent(
                module_id=module.id,
                level=level,
                title=f"{module.title} - {level.value.title()}",
                body=f"This is {level.value} level content for {module.title}. " * 20,
                order=1
            )
            db.add(content)
        
        # Add quiz
        quiz = Quiz(module_id=module.id, level=LevelEnum.intermediate, title=f"{module.title} Quiz")
        db.add(quiz)
        db.flush()
        
        # Add 5 questions
        for i in range(5):
            q = Question(
                quiz_id=quiz.id,
                text=f"Sample question {i+1} for {module.title}?",
                option_a="Option A", option_b="Option B",
                option_c="Option C", option_d="Option D",
                correct_option=random.choice(["A", "B", "C", "D"]),
                explanation=f"This is the explanation for question {i+1}."
            )
            db.add(q)
    
    db.commit()
    print(f"  ✓ Content and quizzes created for DSA and Networks")

def generate_ml_training_data():
    print("🤖 Generating synthetic ML training data...")
    
    # Generate 600 synthetic training samples
    training_data = []
    
    for _ in range(600):
        score = random.uniform(0, 100)
        
        if score >= 75:
            state = "proficient"
            time_spent = random.randint(300, 900)
            access_count = random.randint(1, 3)
        elif score >= 50:
            state = "needs_practice"
            time_spent = random.randint(600, 1800)
            access_count = random.randint(2, 5)
        else:
            state = "struggling"
            time_spent = random.randint(1200, 3600)
            access_count = random.randint(3, 8)
        
        engagement_score = min(100, (access_count * 10) + (time_spent / 60))
        avg_time_per_access = time_spent / access_count
        
        training_data.append({
            "time_spent": time_spent,
            "access_count": access_count,
            "score": score,
            "engagement_score": engagement_score,
            "avg_time_per_access": avg_time_per_access,
            "learning_state": state
        })
    
    # Save to file
    with open("ml/training_data.json", "w") as f:
        json.dump(training_data, f, indent=2)
    
    print(f"  ✓ Generated 600 synthetic training samples")
    print(f"  ✓ Saved to ml/training_data.json")

def main():
    print("\n" + "="*60)
    print("🌱 SEEDING PROCOURSE DATABASE (REAL STUDENTS ONLY)")
    print("="*60 + "\n")
    
    clear_database()
    create_admin_lecturer()
    create_courses()
    create_modules()
    create_content_and_quizzes()
    generate_ml_training_data()
    
    print("\n" + "="*60)
    print("✅ SEED COMPLETE - READY FOR REAL STUDENTS")
    print("="*60)
    print("\n📌 Demo Accounts:")
    print("   Admin:    admin@demo.com / demo1234")
    print("   Lecturer: lecturer@demo.com / demo1234")
    print("\n📌 Next Steps:")
    print("   1. Run: python seed/patch_os_se.py (add OS/SE content)")
    print("   2. Run: python ml/train.py (train ML model)")
    print("   3. Register real students via frontend")
    print("\n")
    
    db.close()

if __name__ == "__main__":
    main()
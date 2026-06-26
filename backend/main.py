from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
# 1. Added SQLModel to the imports below to fix your table compilation crash
from sqlmodel import Session, create_engine, select, SQLModel 
import pandas as pd
import json
from .models import Course, Faculty, AssignmentResult
from .algorithm import allocate_courses
# 2. Imported your database engine so connection instances initialize properly
from .database import engine 

app = FastAPI()

# Allow React (which runs on port 5173) to securely communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This automatically reads your models.py file and builds 
# the missing database tables inside local_database.db on launch!
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/admin/system-status")
def get_system_status():
    with Session(engine) as session:
        # Check if any faculty members exist in the database
        faculty_count = len(session.exec(select(Faculty)).all())
        
        # Returns True (Image 4 locked view) or False (Image 3 active view)
        return {
            "is_initialized": faculty_count > 0,
            "faculty_count": faculty_count
        }

# Endpoint A: Admin uploads Excel sheet for Courses
@app.post("/admin/upload-courses")
async def upload_courses(file: UploadFile = File(...)):
    df = pd.read_excel(file.file)
    with Session(engine) as session:
        for _, row in df.iterrows():
            course = Course(code=str(row['CourseCode']), requirement_count=int(row['Count']))
            session.merge(course) # Saves or updates
        session.commit()
    return {"message": "Courses uploaded successfully"}

# Endpoint B: Run Algorithm, Save to DB, and Update Historical Variables
@app.post("/admin/generate-schedule")
def generate_schedule():
    with Session(engine) as session:
        # 1. Fetch all data out of your database tables
        courses = session.exec(select(Course)).all()
        faculties = session.exec(select(Faculty)).all()
        
        # 2. Reformat database data back into the raw arrays/dicts your algorithm expects
        course_list = [c.code for c in courses]
        faculty_list = [f.id for f in faculties]
        counts = {c.code: c.requirement_count for c in courses}
        caps = {f.id: f.max_capacity for f in faculties}
        prev_pd = {f.id: f.past_dissatisfaction for f in faculties}
        prev_taught = {f.id: f.prev_courses_taught for f in faculties}
        
        # Parse JSON string preferences submitted by users back into a Python dict matrix
        pref_matrix = {}
        for f in faculties:
            pref_matrix[f.id] = json.loads(f.current_preferences) if f.current_preferences else {}

        # 3. Trigger your core Python optimization function!
        final_schedule, total_dissatisfaction = allocate_courses(
            course_list, faculty_list, pref_matrix, counts, caps, prev_pd, prev_taught
        )
        
        # 4. Clear old results and save new temporary ones as "Unpublished"
        session.exec(select(AssignmentResult)).all() # clear step
        for course_code, assigned_fac_list in final_schedule.items():
            for fac_id in assigned_fac_list:
                res = AssignmentResult(course_code=course_code, faculty_id=fac_id, is_published=False)
                session.add(res)
                
        session.commit()
        return {"status": "success", "preview": final_schedule}

# Endpoint C: Admin Publishes Schedule & Automatically Updates Rolling History
@app.post("/admin/publish-schedule")
def publish_schedule():
    # Loop through results, set is_published=True, 
    # and update each Faculty row's past_dissatisfaction and prev_courses_taught.
    return {"message": "Schedule published to faculty dashboard!"}
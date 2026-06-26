from sqlmodel import SQLModel, Field
from typing import Optional

class Course(SQLModel, table=True):
    code: str = Field(primary_key=True) # e.g., "C1"
    requirement_count: int              # How many faculty needed

class Faculty(SQLModel, table=True):
    id: str = Field(primary_key=True)   # e.g., "F1"
    name: str
    max_capacity: int = 0               # Current semester capacity
    past_dissatisfaction: int = 0       # Rolling historical PD_i
    prev_courses_taught: int = 0        # Rolling historical count
    current_preferences: Optional[str] = None # JSON string storing their 1-5 choices

class AssignmentResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_code: str
    faculty_id: str
    is_published: bool = False          # Admin controls visibility
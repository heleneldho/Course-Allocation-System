FROM python:3.11-slim

WORKDIR /app

# 1. Reach inside the backend folder to find requirements.txt
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the rest of the workspace files
COPY . .

# 3. Target main.py inside the backend directory module structure
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
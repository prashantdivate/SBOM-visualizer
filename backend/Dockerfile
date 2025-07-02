FROM python:3.11-slim
WORKDIR /app
COPY main.py .
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

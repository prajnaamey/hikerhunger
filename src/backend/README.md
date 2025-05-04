# HikerHunger Backend

This is the backend server for HikerHunger, a calorie calculator for hikers.

## Project Structure
```
src/backend/
├── __init__.py
├── main.py
└── README.md
```

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

To start the server, run:
```bash
python -m backend.main
```

The server will start on `http://localhost:8000`

You can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 
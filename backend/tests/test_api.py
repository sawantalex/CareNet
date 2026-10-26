import os
import sys
from pathlib import Path

# Ensure backend directory is first in sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "CareNet API"
    assert data["models_loaded"] is True

def test_user_registration_and_login(client):
    # Registration
    reg_payload = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    if reg_res.status_code == 400:  # If user already exists from previous test
        pass
    else:
        assert reg_res.status_code == 201
        assert reg_res.json()["email"] == "testuser@example.com"

    # Login
    login_payload = {
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Get Me profile
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testuser@example.com"

def test_heart_prediction_api(client):
    heart_payload = {
        "user_name": "Test User",
        "Age": 55,
        "Gender": "Male",
        "Blood Pressure": 135,
        "Cholesterol Level": 220,
        "BMI": 27.5,
        "Sleep Hours": 6.5,
        "Triglyceride Level": 180,
        "Fasting Blood Sugar": 110,
        "CRP Level": 2.5,
        "Homocysteine Level": 12.5,
        "Exercise Habits": "Low",
        "Smoking": "Yes",
        "Family Heart Disease": "Yes",
        "Diabetes": "No",
        "High Blood Pressure": "Yes",
        "Low HDL Cholesterol": "No",
        "High LDL Cholesterol": "Yes",
        "Alcohol Consumption": "Medium",
        "Stress Level": "High",
        "Sugar Consumption": "High"
    }

    res = client.post("/api/heart/predict", json=heart_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["module"] == "heart_disease"
    assert "prediction" in data
    assert "risk_level" in data
    assert "disclaimer" in data

def test_medical_prediction_api(client):
    medical_payload = {
        "user_name": "Test User",
        "symptoms": "I have continuous sneezing, chills, body pain and high fever"
    }

    res = client.post("/api/medical/predict", json=medical_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["module"] == "medical_diagnostics"
    assert data["prediction"] is not None
    assert "disclaimer" in data

def test_prediction_history_api(client):
    res = client.get("/api/predictions/history?name=Test%20User")
    assert res.status_code == 200
    data = res.json()
    assert "total" in data
    assert "predictions" in data
    assert data["total"] >= 1
    assert any(p["user_name"] == "Test User" for p in data["predictions"])

def test_chat_assistant(client):
    res = client.post("/api/chat/assistant", json={"message": "What is heart risk?"})
    assert res.status_code == 200
    assert "reply" in res.json()

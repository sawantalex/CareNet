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
    # High risk case
    high_risk_payload = {
        "user_name": "Test User",
        "Age": 62,
        "Gender": "Male",
        "Blood Pressure": 160,
        "Cholesterol Level": 290,
        "BMI": 32.5,
        "Sleep Hours": 5.0,
        "Triglyceride Level": 310,
        "Fasting Blood Sugar": 165,
        "CRP Level": 4.8,
        "Homocysteine Level": 18.2,
        "Exercise Habits": "Low",
        "Smoking": "Yes",
        "Family Heart Disease": "Yes",
        "Diabetes": "Yes",
        "High Blood Pressure": "Yes",
        "Low HDL Cholesterol": "Yes",
        "High LDL Cholesterol": "Yes",
        "Alcohol Consumption": "High",
        "Stress Level": "High",
        "Sugar Consumption": "High"
    }

    res_high = client.post("/api/heart/predict", json=high_risk_payload)
    assert res_high.status_code == 200
    data_high = res_high.json()
    assert data_high["success"] is True
    assert data_high["module"] == "heart_disease"
    assert data_high["risk_level"] == "High"
    assert "High Risk" in data_high["prediction"]
    assert "disclaimer" in data_high

    # Low risk case
    low_risk_payload = {
        "user_name": "Test User",
        "Age": 24,
        "Gender": "Female",
        "Blood Pressure": 110,
        "Cholesterol Level": 160,
        "BMI": 20.5,
        "Sleep Hours": 8.0,
        "Triglyceride Level": 95,
        "Fasting Blood Sugar": 85,
        "CRP Level": 0.4,
        "Homocysteine Level": 6.5,
        "Exercise Habits": "High",
        "Smoking": "No",
        "Family Heart Disease": "No",
        "Diabetes": "No",
        "High Blood Pressure": "No",
        "Low HDL Cholesterol": "No",
        "High LDL Cholesterol": "No",
        "Alcohol Consumption": "Low",
        "Stress Level": "Low",
        "Sugar Consumption": "Low"
    }

    res_low = client.post("/api/heart/predict", json=low_risk_payload)
    assert res_low.status_code == 200
    data_low = res_low.json()
    assert data_low["success"] is True
    assert data_low["risk_level"] == "Low"
    assert "Low Risk" in data_low["prediction"]

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

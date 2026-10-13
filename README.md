# 🏥 CareNet — Medical AI Platform

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>
</p>

> **CareNet** is a full-stack AI-powered medical platform that provides intelligent disease risk prediction, medical diagnosis support, and an AI health assistant — all in a modern, responsive web interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🫀 **Heart Disease Prediction** | ML-based cardiovascular risk assessment using clinical parameters |
| 🩺 **Medical Diagnosis** | AI-assisted symptom analysis and disease diagnosis |
| 💬 **AI Health Chat** | Conversational AI assistant for medical queries |
| 📊 **Prediction Dashboard** | Personal health overview with history & analytics |
| 🔐 **Auth System** | JWT-based secure user registration, login, and profile management |
| 📜 **Prediction History** | Full audit trail of all past predictions per user |

---

## 🧱 Project Structure

```
CareNet/
├── backend/               # FastAPI Python Backend
│   └── app/
│       ├── main.py        # App entry point & CORS config
│       ├── config.py      # App settings (Pydantic)
│       ├── database.py    # SQLAlchemy DB setup (SQLite)
│       ├── dependencies.py# Auth dependencies (JWT)
│       ├── ml/            # Machine Learning core
│       │   ├── heart_predictor.py
│       │   ├── medical_predictor.py
│       │   └── model_loader.py
│       ├── models/        # SQLAlchemy ORM models
│       ├── schemas/       # Pydantic request/response schemas
│       ├── routes/        # API route handlers
│       │   ├── auth.py
│       │   ├── heart.py
│       │   ├── medical.py
│       │   ├── predictions.py
│       │   ├── users.py
│       │   └── chat.py
│       ├── services/      # Business logic layer
│       └── utils/         # Utility helpers
├── frontend/              # React + Vite Frontend
│   └── src/
│       ├── pages/         # Application pages
│       │   ├── Landing.jsx
│       │   ├── Login.jsx / Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── HeartPrediction.jsx
│       │   ├── MedicalDiagnosis.jsx
│       │   └── PredictionHistory.jsx
│       ├── components/    # Reusable UI components
│       ├── services/      # API call layer (axios)
│       ├── context/       # React context (auth state)
│       └── hooks/         # Custom React hooks
├── models/                # Saved ML model files
├── api/                   # Vercel serverless entry (index.py)
├── requirements.txt       # Python dependencies
└── vercel.json            # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+ & npm
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/sawantalex/CareNet.git
cd CareNet
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Create a `.env` file inside `backend/`:**

```env
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./carenet.db
PROJECT_NAME=CareNet API
API_V1_STR=/api/v1
```

**Run the backend server:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🔌 API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |
| `GET`  | `/users/me` | Get current user profile |
| `POST` | `/heart/predict` | Heart disease risk prediction |
| `POST` | `/medical/predict` | Medical diagnosis prediction |
| `GET`  | `/predictions/history` | Fetch user prediction history |
| `POST` | `/chat/message` | Send message to AI health assistant |
| `GET`  | `/api/health` | API health check |

> Full interactive API docs available at `/docs` (Swagger UI) when the backend is running.

---

## 🧠 Machine Learning Models

CareNet uses scikit-learn trained models for medical predictions:

- **Heart Disease Predictor** — Predicts cardiovascular risk based on age, cholesterol, blood pressure, ECG results, etc.
- **Medical Diagnosis Predictor** — General disease classification based on patient-reported symptoms and vitals.

Models are automatically loaded at startup via `model_loader.py`.

---

## 🛠️ Tech Stack

### Backend
| Technology | Role |
|---|---|
| **FastAPI** | High-performance async web framework |
| **SQLAlchemy** | ORM for database interactions |
| **SQLite** | Lightweight development database |
| **scikit-learn** | ML model training & inference |
| **python-jose** | JWT token creation & validation |
| **passlib / bcrypt** | Secure password hashing |
| **Pydantic** | Data validation and settings management |

### Frontend
| Technology | Role |
|---|---|
| **React 18** | Component-based UI library |
| **Vite 5** | Fast build tool & dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Recharts** | Data visualization & charts |
| **Lucide React** | Icon library |
| **Three.js** | 3D visual effects |

---

## ☁️ Deployment

CareNet is configured for **Vercel** deployment.

- **Frontend**: Deployed as a static Vite build
- **Backend**: Deployed as a Vercel Serverless Function via `api/index.py`

The `vercel.json` at the root configures routing between the frontend and backend serverless functions.

---

## 🧪 Running Tests

```bash
cd backend
# Activate the virtual environment first, then:
pytest tests/ -v
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is developed for academic and research purposes.

---

<p align="center">Built with ❤️ by <a href="https://github.com/sawantalex">sawantalex</a></p>

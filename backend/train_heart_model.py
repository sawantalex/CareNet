import numpy as np
import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score, roc_auc_score

def train_and_save_model():
    print("Generating clinically realistic cardiovascular dataset...")
    np.random.seed(42)
    N = 15000

    age = np.random.normal(52, 14, N).clip(18, 85).round().astype(int)
    gender = np.random.choice(['Male', 'Female'], N, p=[0.51, 0.49])
    
    # BMI
    bmi = np.random.normal(27.2, 5.2, N).clip(18.0, 48.0).round(1)
    
    # Blood pressure correlates with age and BMI
    sbp = (105 + 0.42 * age + 0.65 * bmi + np.random.normal(0, 12, N)).clip(90, 220).round().astype(float)
    hbp_flag = np.where((sbp >= 140) | ((sbp >= 130) & (np.random.rand(N) < 0.4)), 'Yes', 'No')

    # Lipids
    chol = (165 + 0.5 * age + 0.9 * bmi + np.random.normal(0, 28, N)).clip(120, 450).round().astype(float)
    trig = (120 + 2.2 * bmi + np.random.normal(0, 40, N)).clip(60, 600).round().astype(float)
    high_ldl = np.where((chol >= 210) | (np.random.rand(N) < 0.25), 'Yes', 'No')
    low_hdl = np.where((bmi >= 30) | (np.random.rand(N) < 0.22), 'Yes', 'No')

    # Glucose & diabetes
    fbs = (85 + 0.35 * age + 0.85 * bmi + np.random.normal(0, 18, N)).clip(70, 300).round().astype(float)
    diabetes = np.where((fbs >= 126) | (np.random.rand(N) < 0.12), 'Yes', 'No')

    # Lifestyle & Biomarkers
    sleep = np.random.normal(7.0, 1.2, N).clip(4.0, 11.0).round(1)
    crp = (0.6 + 0.05 * bmi + np.random.exponential(1.2, N)).clip(0.1, 25.0).round(2)
    homocysteine = (8.0 + 0.07 * age + np.random.normal(0, 3.0, N)).clip(4.0, 35.0).round(1)

    smoking = np.random.choice(['No', 'Yes'], N, p=[0.74, 0.26])
    fam_hist = np.random.choice(['No', 'Yes'], N, p=[0.70, 0.30])
    exercise = np.random.choice(['High', 'Medium', 'Low'], N, p=[0.25, 0.45, 0.30])
    alcohol = np.random.choice(['Low', 'Medium', 'High'], N, p=[0.55, 0.33, 0.12])
    stress = np.random.choice(['Low', 'Medium', 'High'], N, p=[0.30, 0.48, 0.22])
    sugar = np.random.choice(['Low', 'Medium', 'High'], N, p=[0.32, 0.46, 0.22])

    # Cardiovascular Hazard Log-Odds (Calibrated using ACC/AHA ASCVD & Framingham risk factor weights)
    z = -3.8 \
        + 0.045 * (age - 45) \
        + 0.30 * (gender == 'Male') \
        + 0.024 * (sbp - 120) \
        + 0.012 * (chol - 190) \
        + 0.045 * (bmi - 25) \
        + 0.0025 * (trig - 150) \
        + 0.012 * (fbs - 100) \
        + 0.18 * (crp - 1.5) \
        + 0.06 * (homocysteine - 10.0) \
        + 0.95 * (smoking == 'Yes') \
        + 0.85 * (diabetes == 'Yes') \
        + 0.65 * (hbp_flag == 'Yes') \
        + 0.60 * (fam_hist == 'Yes') \
        + 0.45 * (high_ldl == 'Yes') \
        + 0.40 * (low_hdl == 'Yes') \
        + 0.40 * (exercise == 'Low') - 0.45 * (exercise == 'High') \
        + 0.28 * (alcohol == 'High') \
        + 0.25 * (stress == 'High') \
        + 0.22 * (sugar == 'High') \
        - 0.15 * (sleep - 7.0) \
        + np.random.normal(0, 0.4, N)

    true_prob = 1.0 / (1.0 + np.exp(-z))
    y = (true_prob >= 0.50).astype(int)

    print(f"Dataset generated. Prevalence of Heart Disease: {np.mean(y)*100:.2f}%")

    df_data = {
        'Age': age, 'Gender': gender, 'Blood Pressure': sbp, 'Cholesterol Level': chol,
        'BMI': bmi, 'Sleep Hours': sleep, 'Triglyceride Level': trig,
        'Fasting Blood Sugar': fbs, 'CRP Level': crp, 'Homocysteine Level': homocysteine,
        'Exercise Habits': exercise, 'Smoking': smoking, 'Family Heart Disease': fam_hist,
        'Diabetes': diabetes, 'High Blood Pressure': hbp_flag, 'Low HDL Cholesterol': low_hdl,
        'High LDL Cholesterol': high_ldl, 'Alcohol Consumption': alcohol,
        'Stress Level': stress, 'Sugar Consumption': sugar
    }
    X = pd.DataFrame(df_data)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    num_cols = ['Age', 'Blood Pressure', 'Cholesterol Level', 'BMI', 'Sleep Hours', 
                'Triglyceride Level', 'Fasting Blood Sugar', 'CRP Level', 'Homocysteine Level']
    cat_cols = ['Gender', 'Exercise Habits', 'Smoking', 'Family Heart Disease', 'Diabetes', 
                'High Blood Pressure', 'Low HDL Cholesterol', 'High LDL Cholesterol', 
                'Alcohol Consumption', 'Stress Level', 'Sugar Consumption']

    preprocessor = ColumnTransformer(
        transformers=[
            ('numerical', Pipeline([
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', StandardScaler())
            ]), num_cols),
            ('categorical', Pipeline([
                ('imputer', SimpleImputer(strategy='most_frequent')),
                ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
            ]), cat_cols)
        ]
    )

    print("Fitting ColumnTransformer + SVC pipeline...")
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', SVC(probability=True, class_weight='balanced', random_state=42))
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)

    print(f"Validation Metrics:")
    print(f"  Accuracy:  {acc:.4f}")
    print(f"  Recall:    {rec:.4f}")
    print(f"  Precision: {prec:.4f}")
    print(f"  F1 Score:  {f1:.4f}")
    print(f"  ROC-AUC:   {auc:.4f}")

    # Test sample profiles
    sample_low = pd.DataFrame([{
        'Age': 26, 'Gender': 'Female', 'Blood Pressure': 112, 'Cholesterol Level': 165,
        'BMI': 21.5, 'Sleep Hours': 7.5, 'Triglyceride Level': 105, 'Fasting Blood Sugar': 88,
        'CRP Level': 0.8, 'Homocysteine Level': 7.5, 'Exercise Habits': 'High',
        'Smoking': 'No', 'Family Heart Disease': 'No', 'Diabetes': 'No',
        'High Blood Pressure': 'No', 'Low HDL Cholesterol': 'No', 'High LDL Cholesterol': 'No',
        'Alcohol Consumption': 'Low', 'Stress Level': 'Low', 'Sugar Consumption': 'Low'
    }])

    sample_default = pd.DataFrame([{
        'Age': 50, 'Gender': 'Male', 'Blood Pressure': 130, 'Cholesterol Level': 210,
        'BMI': 26.2, 'Sleep Hours': 7.0, 'Triglyceride Level': 160, 'Fasting Blood Sugar': 105,
        'CRP Level': 2.1, 'Homocysteine Level': 11.5, 'Exercise Habits': 'Medium',
        'Smoking': 'No', 'Family Heart Disease': 'Yes', 'Diabetes': 'No',
        'High Blood Pressure': 'No', 'Low HDL Cholesterol': 'No', 'High LDL Cholesterol': 'Yes',
        'Alcohol Consumption': 'Low', 'Stress Level': 'Medium', 'Sugar Consumption': 'Medium'
    }])

    sample_high = pd.DataFrame([{
        'Age': 62, 'Gender': 'Male', 'Blood Pressure': 160, 'Cholesterol Level': 290,
        'BMI': 32.5, 'Sleep Hours': 5.0, 'Triglyceride Level': 310, 'Fasting Blood Sugar': 165,
        'CRP Level': 4.8, 'Homocysteine Level': 18.2, 'Exercise Habits': 'Low',
        'Smoking': 'Yes', 'Family Heart Disease': 'Yes', 'Diabetes': 'Yes',
        'High Blood Pressure': 'Yes', 'Low HDL Cholesterol': 'Yes', 'High LDL Cholesterol': 'Yes',
        'Alcohol Consumption': 'High', 'Stress Level': 'High', 'Sugar Consumption': 'High'
    }])

    prob_low = pipeline.predict_proba(sample_low)[0]
    prob_default = pipeline.predict_proba(sample_default)[0]
    prob_high = pipeline.predict_proba(sample_high)[0]

    print("\n--- Profile Predictions ---")
    print(f"Healthy Profile (Age 26): Risk Probability = {prob_low[1]*100:.2f}% (Expected Low)")
    print(f"Default Profile (Age 50): Risk Probability = {prob_default[1]*100:.2f}% (Expected Moderate/Low)")
    print(f"High Risk Profile (Age 62): Risk Probability = {prob_high[1]*100:.2f}% (Expected High)")

    assert prob_low[1] < 0.25, f"Low risk test failed: {prob_low[1]}"
    assert prob_high[1] > 0.75, f"High risk test failed: {prob_high[1]}"

    # Save trained model
    out_path = Path("d:/CareNet/models/heart_disease_model.pkl")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, out_path)
    print(f"\nSuccessfully saved calibrated heart disease model to {out_path}")

if __name__ == "__main__":
    train_and_save_model()

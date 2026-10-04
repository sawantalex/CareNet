import pathlib
import sklearn.compose._column_transformer as ct
if not hasattr(ct, '_RemainderColsList'):
    class _RemainderColsList(list):
        pass
    ct._RemainderColsList = _RemainderColsList

import joblib
import pandas as pd
import numpy as np

def inspect_models():
    root_dir = pathlib.Path(__file__).resolve().parents[3] if len(pathlib.Path(__file__).resolve().parents) > 3 else pathlib.Path(__file__).resolve().parents[2]
    heart_path = root_dir / "models" / "heart_disease_model.pkl"
    medical_path = root_dir / "models" / "medical_diagnosis_model.pkl"

    if not heart_path.exists():
        heart_path = root_dir / "backend" / "models" / "heart_disease_model.pkl"
    if not medical_path.exists():
        medical_path = root_dir / "backend" / "models" / "medical_diagnosis_model.pkl"

    out_lines = []
    out_lines.append("==================================================")
    out_lines.append("CARENET MODEL DIAGNOSTIC INSPECTOR")
    out_lines.append("==================================================")

    # 1. Heart Model Inspection
    out_lines.append("\n--- 1. HEART DISEASE MODEL ---")
    if not heart_path.exists():
        out_lines.append(f"Error: {heart_path} not found!")
    else:
        try:
            heart_model = joblib.load(heart_path)
            out_lines.append(f"Model Type: {type(heart_model)}")
            out_lines.append(f"Is Pipeline: {hasattr(heart_model, 'steps') or hasattr(heart_model, 'named_steps')}")
            
            if hasattr(heart_model, 'named_steps'):
                out_lines.append("Pipeline Steps:")
                for name, step in heart_model.named_steps.items():
                    out_lines.append(f"  - {name}: {type(step)}")
                
                if 'preprocessor' in heart_model.named_steps:
                    prep = heart_model.named_steps['preprocessor']
                    if hasattr(prep, 'transformers_'):
                        out_lines.append("\nPreprocessor Transformers:")
                        for trans_tuple in prep.transformers_:
                            name = trans_tuple[0]
                            trans = trans_tuple[1]
                            cols = trans_tuple[2]
                            out_lines.append(f"    Transformer '{name}': {cols} -> {type(trans)}")

            clf = heart_model.named_steps['classifier'] if hasattr(heart_model, 'named_steps') and 'classifier' in heart_model.named_steps else heart_model
            out_lines.append(f"Classifier Type: {type(clf)}")
            has_proba = hasattr(heart_model, 'predict_proba')
            out_lines.append(f"Has predict_proba: {has_proba}")

            # Test Heart Model with sample dataframe
            test_heart_data = pd.DataFrame([{
                'Age': 45,
                'Gender': 'Male',
                'Blood Pressure': 120,
                'Cholesterol Level': 200,
                'BMI': 24.5,
                'Sleep Hours': 7.5,
                'Triglyceride Level': 150,
                'Fasting Blood Sugar': 95,
                'CRP Level': 1.2,
                'Homocysteine Level': 10.0,
                'Exercise Habits': 'Medium',
                'Smoking': 'No',
                'Family Heart Disease': 'No',
                'Diabetes': 'No',
                'High Blood Pressure': 'No',
                'Low HDL Cholesterol': 'No',
                'High LDL Cholesterol': 'No',
                'Alcohol Consumption': 'Low',
                'Stress Level': 'Medium',
                'Sugar Consumption': 'Medium'
            }])
            out_lines.append("\nTesting Heart Model prediction with sample input:")
            out_lines.append(str(test_heart_data))
            pred = heart_model.predict(test_heart_data)
            out_lines.append(f"Prediction result: {pred[0]} (Type: {type(pred[0])})")
            if has_proba:
                try:
                    proba = heart_model.predict_proba(test_heart_data)
                    out_lines.append(f"Probabilities: {proba}")
                    if hasattr(clf, 'classes_'):
                        out_lines.append(f"Classes: {clf.classes_}")
                except Exception as pe:
                    out_lines.append(f"Probability error: {pe}")

        except Exception as e:
            out_lines.append(f"Error inspecting heart model: {e}")

    # 2. Medical Model Inspection
    out_lines.append("\n--- 2. MEDICAL DIAGNOSIS MODEL ---")
    if not medical_path.exists():
        out_lines.append(f"Error: {medical_path} not found!")
    else:
        try:
            medical_model = joblib.load(medical_path)
            out_lines.append(f"Model Type: {type(medical_model)}")
            out_lines.append(f"Is Pipeline: {hasattr(medical_model, 'steps') or hasattr(medical_model, 'named_steps')}")

            if hasattr(medical_model, 'named_steps'):
                out_lines.append("Pipeline Steps:")
                for name, step in medical_model.named_steps.items():
                    out_lines.append(f"  - {name}: {type(step)}")

            med_clf = medical_model.named_steps['classifier'] if hasattr(medical_model, 'named_steps') and 'classifier' in medical_model.named_steps else medical_model
            out_lines.append(f"Medical Classifier Type: {type(med_clf)}")
            has_proba = hasattr(medical_model, 'predict_proba')
            out_lines.append(f"Has predict_proba: {has_proba}")
            if hasattr(med_clf, 'classes_'):
                out_lines.append(f"Number of classes: {len(med_clf.classes_)}")
                out_lines.append(f"Sample classes (first 10): {med_clf.classes_[:10]}")

            out_lines.append("\nTesting Medical Model prediction with sample symptom input:")
            test_symptoms = pd.Series(["I have high fever, headache, cough and sore throat"])
            med_pred = medical_model.predict(test_symptoms)
            out_lines.append(f"Medical Prediction result: {med_pred[0]}")
            if has_proba:
                try:
                    med_proba = medical_model.predict_proba(test_symptoms)
                    out_lines.append(f"Medical Probabilities shape: {med_proba.shape}")
                except Exception as mpe:
                    out_lines.append(f"Medical probability note/error: {mpe}")

        except Exception as e:
            out_lines.append(f"Error inspecting medical model: {e}")

    output_str = "\n".join(out_lines)
    print(output_str)
    root_dir = pathlib.Path(__file__).resolve().parents[3] if len(pathlib.Path(__file__).resolve().parents) > 3 else pathlib.Path(__file__).resolve().parents[2]
    out_file = root_dir / "backend_model_info.txt"
    out_file.write_text(output_str, encoding="utf-8")

if __name__ == "__main__":
    inspect_models()

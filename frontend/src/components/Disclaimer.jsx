import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = ({ text }) => {
  const disclaimerText = text || "CareNet provides AI-based predictions for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.";
  
  return (
    <div className="disclaimer-box">
      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <strong style={{ display: 'block', marginBottom: '4px' }}>Important Medical Disclaimer</strong>
        <p>{disclaimerText}</p>
      </div>
    </div>
  );
};

export default Disclaimer;

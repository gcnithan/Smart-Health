# Disease Prediction System Integration Guide

## Overview
This guide explains how to integrate the trained ML models for disease prediction based on sensor data and ASHA worker symptoms.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ML Service    │
│   (React App)   │◄──►│   (Node.js)     │◄──►│   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Firestore DB  │
                       │   (Predictions) │
                       └─────────────────┘
```

## Components

### 1. ML Service (`/services/mlService.js`)
- **Purpose**: Handles communication with trained ML models
- **Features**:
  - Combines sensor data with ASHA worker symptoms
  - Maps sensor readings to ML model input parameters
  - Calculates health scores and risk levels
  - Generates recommendations

### 2. Disease Controller (`/controllers/diseaseController.js`)
- **Purpose**: Business logic for disease prediction
- **Features**:
  - Validates input data
  - Manages prediction workflow
  - Saves predictions to database
  - Provides prediction history and statistics

### 3. Disease Routes (`/routes/disease.routes.js`)
- **Purpose**: API endpoints for disease prediction
- **Endpoints**:
  - `POST /api/disease/predict` - Main prediction endpoint
  - `GET /api/disease/history` - Prediction history
  - `GET /api/disease/statistics` - Prediction statistics
  - `GET /api/disease/health` - ML service health check
  - `GET /api/disease/recommendations/:diseaseType` - Disease recommendations

## Data Flow

### 1. Input Data Collection
```javascript
// Sensor Data (from IoT devices)
const sensorData = {
  temperature: 28.5,  // °C
  pH: 6.9,           // pH level
  EC: 1.2            // Electrical Conductivity (mS/cm)
};

// ASHA Worker Symptoms
const symptoms = {
  symptoms: ["fever", "diarrhea", "vomiting", "dehydration"],
  patient_age: 35,
  patient_gender: "male",
  water_source: "River",
  access_to_clean_water: 60,  // percentage
  healthcare_access: 70,      // percentage
  sanitation_coverage: 75,    // percentage
  recent_travel: false,
  contact_with_sick: true,
  vaccination_status: "unknown"
};
```

### 2. Data Processing
The ML service processes the input data by:
- **Sensor Data Mapping**: Converts sensor readings to ML model parameters
- **Symptom Analysis**: Calculates symptom severity scores
- **Risk Factor Assessment**: Evaluates environmental and health factors

### 3. ML Model Prediction
```javascript
// Example prediction request
const predictionData = {
  contaminant_level: 2.0,      // Derived from EC
  ph_level: 6.9,              // Direct from sensor
  turbidity: 5,               // Derived from pH
  dissolved_oxygen: 6.5,      // Derived from temperature
  nitrate_level: 3.0,         // Derived from EC
  lead_concentration: 3.0,    // Derived from pH
  bacteria_count: 200,        // Derived from temperature + pH + EC
  water_source: "River",
  access_to_clean_water: 60,
  // ... other parameters
};
```

### 4. Prediction Response
```javascript
{
  "predictions": [
    {
      "disease": "cholera",
      "probability": 0.85,
      "confidence": 0.78,
      "risk_level": "high"
    },
    {
      "disease": "diarrheal",
      "probability": 0.72,
      "confidence": 0.75,
      "risk_level": "high"
    },
    {
      "disease": "typhoid",
      "probability": 0.45,
      "confidence": 0.70,
      "risk_level": "medium"
    }
  ],
  "overall_risk": "high",
  "recommendations": [
    {
      "disease": "cholera",
      "action": "Immediate medical attention required",
      "steps": [
        "Administer oral rehydration therapy",
        "Collect stool sample for testing",
        "Isolate patient if confirmed",
        "Notify health authorities"
      ]
    }
  ]
}
```

## Supported Diseases

### 1. Cholera
- **Risk Factors**: High contamination, poor water quality, severe symptoms
- **Key Indicators**: High EC, low pH, high bacteria count, severe diarrhea
- **Treatment**: ORT, antibiotics, isolation

### 2. Diarrheal Diseases
- **Risk Factors**: Moderate contamination, vulnerable populations
- **Key Indicators**: Medium EC, moderate symptoms, age factors
- **Treatment**: Hydration, monitoring, supportive care

### 3. Typhoid
- **Risk Factors**: High bacterial load, travel history, poor sanitation
- **Key Indicators**: High bacteria count, fever, travel exposure
- **Treatment**: Antibiotics, blood culture, vaccination check

## API Usage Examples

### 1. Predict All Diseases
```bash
curl -X POST http://localhost:3001/api/disease/predict \
  -H "Content-Type: application/json" \
  -d '{
    "sensorData": {
      "temperature": 28.5,
      "pH": 6.9,
      "EC": 1.2
    },
    "symptoms": {
      "symptoms": ["fever", "diarrhea", "vomiting"],
      "patient_age": 35,
      "water_source": "River",
      "access_to_clean_water": 60
    },
    "diseaseType": "all"
  }'
```

### 2. Predict Specific Disease
```bash
curl -X POST http://localhost:3001/api/disease/predict \
  -H "Content-Type: application/json" \
  -d '{
    "sensorData": {
      "temperature": 32.0,
      "pH": 6.2,
      "EC": 2.8
    },
    "symptoms": {
      "symptoms": ["fever", "diarrhea", "dehydration"],
      "patient_age": 28,
      "water_source": "River",
      "recent_travel": true
    },
    "diseaseType": "cholera"
  }'
```

### 3. Get Prediction History
```bash
curl http://localhost:3001/api/disease/history?limit=10&diseaseType=cholera
```

### 4. Get Disease Recommendations
```bash
curl http://localhost:3001/api/disease/recommendations/cholera
```

## Risk Level Classification

| Risk Level | Probability Range | Action Required |
|------------|------------------|-----------------|
| **Critical** | ≥ 0.8 | Immediate medical attention |
| **High** | 0.6 - 0.8 | Urgent medical evaluation |
| **Medium** | 0.4 - 0.6 | Monitor closely |
| **Low** | 0.2 - 0.4 | Routine monitoring |
| **Minimal** | < 0.2 | Standard care |

## Integration with Frontend

### 1. React Component Example
```javascript
import React, { useState } from 'react';

const DiseasePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictDisease = async (sensorData, symptoms) => {
    setLoading(true);
    try {
      const response = await fetch('/api/disease/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sensorData,
          symptoms,
          diseaseType: 'all'
        })
      });
      const result = await response.json();
      setPrediction(result.data);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Prediction form and results */}
    </div>
  );
};
```

### 2. ASHA Worker Interface
- **Input Form**: Collect symptoms and patient information
- **Sensor Integration**: Automatically fetch latest sensor data
- **Results Display**: Show predictions with risk levels and recommendations
- **Action Items**: Provide step-by-step treatment protocols

## ML Model Integration

### 1. Model Files
- `cholera_model.pkl` - Cholera prediction model
- `diarrheal_model.pkl` - Diarrheal disease prediction model
- `typhoid_model.pkl` - Typhoid prediction model

### 2. FastAPI Service
```python
# Example endpoint structure
@app.post("/predict_cholera")
async def predict_cholera(request: PredictionRequest):
    # Load model and make prediction
    return PredictionResponse(...)
```

### 3. Model Input Parameters
- **Environmental**: Water quality, sanitation, temperature
- **Demographic**: Age, gender, location
- **Health**: Symptoms, vaccination status, travel history
- **Socioeconomic**: Healthcare access, GDP, urbanization

## Deployment

### 1. Backend Deployment
```bash
# Install dependencies
npm install

# Start server
node server.js
```

### 2. ML Service Deployment
```bash
# Install Python dependencies
pip install fastapi uvicorn

# Start ML service
python test-ml-server.py
```

### 3. Environment Variables
```bash
# Backend
PORT=3001
NODE_ENV=production

# ML Service
ML_SERVICE_URL=http://127.0.0.1:8000
```

## Monitoring and Maintenance

### 1. Health Checks
- Backend: `GET /health`
- ML Service: `GET /api/disease/health`

### 2. Performance Metrics
- Prediction accuracy
- Response times
- Error rates
- Model confidence scores

### 3. Data Quality
- Sensor data validation
- Symptom data completeness
- Prediction result verification

## Troubleshooting

### Common Issues

1. **ML Service Unavailable**
   - Check if FastAPI server is running on port 8000
   - Verify model files are accessible
   - Check network connectivity

2. **Prediction Errors**
   - Validate input data format
   - Check required fields
   - Verify sensor data ranges

3. **Database Issues**
   - Check Firestore connection
   - Verify service account key
   - Check collection permissions

### Debug Mode
```bash
# Enable debug logging
DEBUG=true node server.js
```

## Future Enhancements

1. **Additional Diseases**: Expand to include more waterborne diseases
2. **Real-time Predictions**: Implement streaming predictions
3. **Model Updates**: Add model versioning and updates
4. **Mobile Integration**: Optimize for mobile ASHA worker apps
5. **Analytics Dashboard**: Add comprehensive analytics and reporting

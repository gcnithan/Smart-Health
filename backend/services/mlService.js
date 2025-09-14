const axios = require('axios');
const path = require('path');

class MLService {
  constructor() {
    this.baseURL = 'http://127.0.0.1:8000';
    this.models = {
      cholera: 'cholera_model.pkl',
      diarrheal: 'diarrheal_model.pkl',
      typhoid: 'typhoid_model.pkl'
    };
  }

  // Predict disease based on sensor data and symptoms
  async predictDisease(sensorData, symptoms, diseaseType = 'all') {
    try {
      console.log(`🔮 Predicting ${diseaseType} disease...`);
      
      // Combine sensor data with symptoms
      const predictionData = this.combineSensorAndSymptoms(sensorData, symptoms);
      
      if (diseaseType === 'all') {
        // Predict all diseases
        const predictions = await Promise.all([
          this.predictCholera(predictionData),
          this.predictDiarrheal(predictionData),
          this.predictTyphoid(predictionData)
        ]);
        
        return this.formatAllPredictions(predictions);
      } else {
        // Predict specific disease
        return await this.predictSpecificDisease(diseaseType, predictionData);
      }
      
    } catch (error) {
      console.error('❌ Error in disease prediction:', error);
      throw new Error(`Disease prediction failed: ${error.message}`);
    }
  }

  // Combine sensor data with ASHA worker symptoms
  combineSensorAndSymptoms(sensorData, symptoms) {
    const combined = {
      // Sensor data mapping
      contaminant_level: this.mapSensorToContaminant(sensorData),
      ph_level: sensorData.pH || 7.0,
      turbidity: this.mapSensorToTurbidity(sensorData),
      dissolved_oxygen: this.mapSensorToDissolvedOxygen(sensorData),
      nitrate_level: this.mapSensorToNitrate(sensorData),
      lead_concentration: this.mapSensorToLead(sensorData),
      bacteria_count: this.mapSensorToBacteria(sensorData),
      
      // Environmental factors from sensor data
      temperature: sensorData.temperature || 25,
      
      // ASHA worker provided symptoms and data
      water_source: symptoms.water_source || "Unknown",
      access_to_clean_water: symptoms.access_to_clean_water || 50,
      infant_mortality_rate: symptoms.infant_mortality_rate || 20,
      gdp: symptoms.gdp || 10000,
      healthcare_access: symptoms.healthcare_access || 60,
      urbanization_rate: symptoms.urbanization_rate || 30,
      sanitation_coverage: symptoms.sanitation_coverage || 70,
      rainfall_per_year: symptoms.rainfall_per_year || 1000,
      population_density: symptoms.population_density || 200,
      
      // Additional symptom-based factors
      symptom_severity: this.calculateSymptomSeverity(symptoms),
      patient_age: symptoms.patient_age || 30,
      patient_gender: symptoms.patient_gender || "Unknown",
      recent_travel: symptoms.recent_travel || false,
      contact_with_sick: symptoms.contact_with_sick || false,
      vaccination_status: symptoms.vaccination_status || "Unknown"
    };

    console.log('📊 Combined prediction data:', combined);
    return combined;
  }

  // Map sensor data to contaminant level
  mapSensorToContaminant(sensorData) {
    // EC (Electrical Conductivity) is a good indicator of contamination
    if (sensorData.EC > 2.0) return 4.0; // High contamination
    if (sensorData.EC > 1.5) return 3.0; // Medium-high contamination
    if (sensorData.EC > 1.0) return 2.0; // Medium contamination
    return 1.0; // Low contamination
  }

  // Map sensor data to turbidity
  mapSensorToTurbidity(sensorData) {
    // pH can indicate water clarity issues
    if (sensorData.pH < 6.0 || sensorData.pH > 8.5) return 15; // High turbidity
    if (sensorData.pH < 6.5 || sensorData.pH > 8.0) return 10; // Medium turbidity
    return 5; // Low turbidity
  }

  // Map sensor data to dissolved oxygen
  mapSensorToDissolvedOxygen(sensorData) {
    // Temperature affects dissolved oxygen levels
    if (sensorData.temperature > 30) return 5.0; // Low DO
    if (sensorData.temperature > 25) return 6.5; // Medium DO
    return 8.0; // High DO
  }

  // Map sensor data to nitrate level
  mapSensorToNitrate(sensorData) {
    // EC can indicate nitrate presence
    if (sensorData.EC > 1.8) return 10.0; // High nitrate
    if (sensorData.EC > 1.3) return 6.0; // Medium nitrate
    return 3.0; // Low nitrate
  }

  // Map sensor data to lead concentration
  mapSensorToLead(sensorData) {
    // pH affects lead solubility
    if (sensorData.pH < 6.5) return 5.0; // High lead risk
    if (sensorData.pH < 7.0) return 3.0; // Medium lead risk
    return 1.0; // Low lead risk
  }

  // Map sensor data to bacteria count
  mapSensorToBacteria(sensorData) {
    // Temperature and pH affect bacterial growth
    let bacteriaCount = 100; // Base count
    
    if (sensorData.temperature > 28) bacteriaCount += 100; // Higher temp = more bacteria
    if (sensorData.pH < 6.5 || sensorData.pH > 8.0) bacteriaCount += 50; // Extreme pH = more bacteria
    if (sensorData.EC > 1.5) bacteriaCount += 75; // High EC = more bacteria
    
    return bacteriaCount;
  }

  // Calculate symptom severity score
  calculateSymptomSeverity(symptoms) {
    let severity = 0;
    
    // Common symptoms and their weights
    const symptomWeights = {
      fever: 3,
      diarrhea: 4,
      vomiting: 3,
      dehydration: 4,
      abdominal_pain: 2,
      nausea: 2,
      headache: 1,
      fatigue: 1,
      muscle_aches: 1,
      rash: 2,
      jaundice: 3,
      confusion: 4
    };

    if (symptoms.symptoms && Array.isArray(symptoms.symptoms)) {
      symptoms.symptoms.forEach(symptom => {
        if (symptomWeights[symptom.toLowerCase()]) {
          severity += symptomWeights[symptom.toLowerCase()];
        }
      });
    }

    return Math.min(severity, 10); // Cap at 10
  }

  // Predict cholera
  async predictCholera(data) {
    try {
      const response = await axios.post(`${this.baseURL}/predict_cholera`, data);
      return {
        disease: 'cholera',
        probability: response.data.probability || response.data.prediction,
        confidence: response.data.confidence || 0.8,
        risk_level: this.calculateRiskLevel(response.data.probability || response.data.prediction)
      };
    } catch (error) {
      console.error('❌ Cholera prediction error:', error.message);
      return {
        disease: 'cholera',
        probability: 0.1,
        confidence: 0.1,
        risk_level: 'low',
        error: 'Prediction service unavailable'
      };
    }
  }

  // Predict diarrheal diseases
  async predictDiarrheal(data) {
    try {
      const response = await axios.post(`${this.baseURL}/predict_diarrheal`, data);
      return {
        disease: 'diarrheal',
        probability: response.data.probability || response.data.prediction,
        confidence: response.data.confidence || 0.8,
        risk_level: this.calculateRiskLevel(response.data.probability || response.data.prediction)
      };
    } catch (error) {
      console.error('❌ Diarrheal prediction error:', error.message);
      return {
        disease: 'diarrheal',
        probability: 0.1,
        confidence: 0.1,
        risk_level: 'low',
        error: 'Prediction service unavailable'
      };
    }
  }

  // Predict typhoid
  async predictTyphoid(data) {
    try {
      const response = await axios.post(`${this.baseURL}/predict_typhoid`, data);
      return {
        disease: 'typhoid',
        probability: response.data.probability || response.data.prediction,
        confidence: response.data.confidence || 0.8,
        risk_level: this.calculateRiskLevel(response.data.probability || response.data.prediction)
      };
    } catch (error) {
      console.error('❌ Typhoid prediction error:', error.message);
      return {
        disease: 'typhoid',
        probability: 0.1,
        confidence: 0.1,
        risk_level: 'low',
        error: 'Prediction service unavailable'
      };
    }
  }

  // Predict specific disease
  async predictSpecificDisease(diseaseType, data) {
    switch (diseaseType.toLowerCase()) {
      case 'cholera':
        return await this.predictCholera(data);
      case 'diarrheal':
        return await this.predictDiarrheal(data);
      case 'typhoid':
        return await this.predictTyphoid(data);
      default:
        throw new Error(`Unknown disease type: ${diseaseType}`);
    }
  }

  // Format predictions for all diseases
  formatAllPredictions(predictions) {
    const results = {
      predictions: predictions,
      overall_risk: this.calculateOverallRisk(predictions),
      recommendations: this.generateRecommendations(predictions),
      timestamp: new Date().toISOString()
    };

    // Sort predictions by probability
    results.predictions.sort((a, b) => b.probability - a.probability);
    
    return results;
  }

  // Calculate overall risk level
  calculateOverallRisk(predictions) {
    const maxProbability = Math.max(...predictions.map(p => p.probability));
    return this.calculateRiskLevel(maxProbability);
  }

  // Calculate risk level based on probability
  calculateRiskLevel(probability) {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.4) return 'medium';
    if (probability >= 0.2) return 'low';
    return 'minimal';
  }

  // Generate recommendations based on predictions
  generateRecommendations(predictions) {
    const recommendations = [];
    
    predictions.forEach(prediction => {
      if (prediction.probability > 0.3) {
        switch (prediction.disease) {
          case 'cholera':
            recommendations.push({
              disease: 'cholera',
              action: 'Immediate medical attention required',
              steps: [
                'Administer oral rehydration therapy',
                'Collect stool sample for testing',
                'Isolate patient if confirmed',
                'Notify health authorities',
                'Check water source contamination'
              ]
            });
            break;
          case 'diarrheal':
            recommendations.push({
              disease: 'diarrheal',
              action: 'Monitor and provide supportive care',
              steps: [
                'Ensure adequate hydration',
                'Monitor for dehydration signs',
                'Consider antibiotic treatment if severe',
                'Check water and food sources',
                'Maintain hygiene protocols'
              ]
            });
            break;
          case 'typhoid':
            recommendations.push({
              disease: 'typhoid',
              action: 'Urgent medical evaluation needed',
              steps: [
                'Blood culture and Widal test',
                'Antibiotic treatment protocol',
                'Monitor for complications',
                'Check vaccination status',
                'Investigate food/water sources'
              ]
            });
            break;
        }
      }
    });

    return recommendations;
  }

  // Health check for ML service
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, { timeout: 5000 });
      return {
        status: 'healthy',
        message: 'ML service is running',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'ML service is not responding',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = MLService;

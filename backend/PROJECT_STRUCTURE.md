# Smart Community Health - Backend Project Structure

## Overview
This backend follows the **MVC (Model-View-Controller)** pattern with a clean separation of concerns.

## Directory Structure
```
backend/
├── config/
│   └── config.js              # Firestore configuration and initialization
├── controllers/
│   ├── sensorController.js    # Sensor data business logic
│   └── mlController.js        # ML data processing logic
├── routes/
│   ├── sensor.routes.js       # Sensor API routes
│   └── ml.routes.js          # ML API routes
├── middlewares/
│   └── error.middleware.js    # Error handling middleware
├── app.js                     # Express app configuration
├── server.js                  # Server startup file
├── package.json               # Dependencies and scripts
├── serviceAccountKey.json     # Firebase service account key
├── API_ENDPOINTS.md          # API documentation
└── PROJECT_STRUCTURE.md      # This file
```

## Architecture Components

### 1. Controllers (`/controllers/`)
**Purpose**: Contains business logic and handles data processing

#### `sensorController.js`
- **Class**: `SensorController`
- **Methods**:
  - `getAllReadings()` - Get all sensor readings
  - `getLatestReading()` - Get latest sensor reading
  - `getReadingsByDateRange()` - Get readings by date range
  - `getReadingsByDevice()` - Get readings by device ID
  - `getSensorStatistics()` - Calculate sensor statistics
  - `addSensorReading()` - Add new sensor reading
  - `updateSensorReading()` - Update existing reading
  - `deleteSensorReading()` - Delete sensor reading

#### `mlController.js`
- **Class**: `MLController`
- **Methods**:
  - `getMLData()` - Get data for ML processing
  - `getAnomalyData()` - Get data for anomaly detection
  - `getTrendData()` - Get data for trend analysis
  - `getPredictiveData()` - Get data for predictive analysis
  - `getHealthAssessmentData()` - Get data with health scores
  - `groupDataByHour()` - Helper: Group data by hour
  - `groupDataByDay()` - Helper: Group data by day
  - `calculateHealthScore()` - Helper: Calculate health score
  - `calculateHealthMetrics()` - Helper: Calculate health metrics

### 2. Routes (`/routes/`)
**Purpose**: Define API endpoints and route requests to controllers

#### `sensor.routes.js`
- Maps HTTP methods to controller methods
- Handles URL parameters and query strings
- Clean, minimal route definitions

#### `ml.routes.js`
- Maps ML-specific endpoints to controller methods
- Handles ML data processing requests

### 3. Configuration (`/config/`)
**Purpose**: Application configuration and external service setup

#### `config.js`
- Firebase Admin SDK initialization
- Firestore database connection
- Error handling for connection issues

### 4. Middleware (`/middlewares/`)
**Purpose**: Cross-cutting concerns and request processing

#### `error.middleware.js`
- Centralized error handling
- Consistent error response format
- Firestore-specific error mapping

### 5. Application Files
- **`app.js`**: Express app setup, middleware configuration, route mounting
- **`server.js`**: Server startup and port configuration

## Design Patterns Used

### 1. MVC Pattern
- **Model**: Firestore database (handled by config)
- **View**: JSON API responses
- **Controller**: Business logic in controller classes

### 2. Static Methods
- Controllers use static methods for stateless operations
- No need for instantiation
- Easy to test and maintain

### 3. Separation of Concerns
- Routes handle HTTP concerns
- Controllers handle business logic
- Config handles external services
- Middleware handles cross-cutting concerns

### 4. Error Handling
- Centralized error handling middleware
- Consistent error response format
- Proper HTTP status codes

## Benefits of This Structure

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Consistent code organization

### 2. **Scalability**
- Easy to add new controllers and routes
- Modular design allows independent development
- Clear patterns for new features

### 3. **Testability**
- Controllers can be unit tested independently
- Routes are simple and focused
- Clear dependencies and interfaces

### 4. **Readability**
- Self-documenting code structure
- Clear naming conventions
- Logical file organization

## Adding New Features

### 1. New Controller
1. Create new controller file in `/controllers/`
2. Define static methods for business logic
3. Export the controller class

### 2. New Routes
1. Create new route file in `/routes/`
2. Import and use the controller
3. Mount routes in `app.js`

### 3. New Middleware
1. Create middleware file in `/middlewares/`
2. Add to `app.js` middleware stack
3. Use appropriate placement in stack

## Dependencies
- **express**: Web framework
- **firebase-admin**: Firestore database access
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Environment Setup
1. Install dependencies: `npm install`
2. Configure Firebase service account key
3. Start server: `node server.js`
4. Server runs on port 3001 by default

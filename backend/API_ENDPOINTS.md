# Smart Community Health - API Endpoints

## Server Information
- **Base URL**: `http://localhost:3001`
- **Health Check**: `GET /health`

## Health Check
- `GET /health` - Server health status

## User Management
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/search/:term` - Search users by name
- `GET /api/users/location/:district` - Get users by district
- `PATCH /api/users/:id/activate` - Activate user
- `PATCH /api/users/:id/deactivate` - Deactivate user

## District Management
- `POST /api/districts` - Create district
- `GET /api/districts` - Get all districts
- `GET /api/districts/stats` - Get district statistics
- `GET /api/districts/search/:term` - Search districts by name
- `GET /api/districts/:id` - Get district by ID
- `PUT /api/districts/:id` - Update district
- `DELETE /api/districts/:id` - Delete district
- `PATCH /api/districts/:id/activate` - Activate district
- `PATCH /api/districts/:id/deactivate` - Deactivate district
- `PATCH /api/districts/:id/archive` - Archive district

## Taluk Management
- `POST /api/taluks` - Create taluk
- `GET /api/taluks` - Get all taluks
- `GET /api/taluks/stats` - Get taluk statistics
- `GET /api/taluks/search/:term` - Search taluks by name
- `GET /api/taluks/district/:districtId` - Get taluks by district
- `GET /api/taluks/:id` - Get taluk by ID
- `PUT /api/taluks/:id` - Update taluk
- `DELETE /api/taluks/:id` - Delete taluk
- `PATCH /api/taluks/:id/activate` - Activate taluk
- `PATCH /api/taluks/:id/deactivate` - Deactivate taluk
- `PATCH /api/taluks/:id/archive` - Archive taluk

## Hobli Management
- `POST /api/hoblis` - Create hobli
- `GET /api/hoblis` - Get all hoblis
- `GET /api/hoblis/stats` - Get hobli statistics
- `GET /api/hoblis/search/:term` - Search hoblis by name
- `GET /api/hoblis/district/:districtId` - Get hoblis by district
- `GET /api/hoblis/taluk/:talukId` - Get hoblis by taluk
- `GET /api/hoblis/:id` - Get hobli by ID
- `PUT /api/hoblis/:id` - Update hobli
- `DELETE /api/hoblis/:id` - Delete hobli
- `PATCH /api/hoblis/:id/activate` - Activate hobli
- `PATCH /api/hoblis/:id/deactivate` - Deactivate hobli
- `PATCH /api/hoblis/:id/archive` - Archive hobli

## Village Management
- `POST /api/villages` - Create village
- `GET /api/villages` - Get all villages
- `GET /api/villages/stats` - Get village statistics
- `GET /api/villages/search/:term` - Search villages by name
- `GET /api/villages/code/:code` - Get village by code
- `GET /api/villages/district/:districtId` - Get villages by district
- `GET /api/villages/taluk/:talukId` - Get villages by taluk
- `GET /api/villages/hobli/:hobliId` - Get villages by hobli
- `GET /api/villages/:id` - Get village by ID
- `PUT /api/villages/:id` - Update village
- `DELETE /api/villages/:id` - Delete village
- `PATCH /api/villages/:id/activate` - Activate village
- `PATCH /api/villages/:id/deactivate` - Deactivate village
- `PATCH /api/villages/:id/archive` - Archive village

## Sensor Data
- `GET /api/sensors` - Get all sensor readings
- `GET /api/sensors/latest` - Get latest sensor reading
- `GET /api/sensors/range` - Get sensor readings by date range
- `GET /api/sensors/device/:deviceId` - Get sensor readings by device
- `GET /api/sensors/stats` - Get sensor statistics
- `POST /api/sensors` - Add new sensor reading

## Machine Learning
- `POST /api/ml/predict` - Get disease prediction
- `GET /api/ml/models` - Get available ML models
- `GET /api/ml/status` - Get ML service status

## Disease Management
- `GET /api/disease` - Get all diseases
- `GET /api/disease/:id` - Get disease by ID
- `POST /api/disease` - Create disease
- `PUT /api/disease/:id` - Update disease
- `DELETE /api/disease/:id` - Delete disease
- `GET /api/disease/search/:term` - Search diseases
- `GET /api/disease/category/:category` - Get diseases by category
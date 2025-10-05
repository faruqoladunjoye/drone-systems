# Drone Delivery System

A REST API service for managing a fleet of drones that deliver medications. This system allows clients to communicate with drones through a dispatch controller, handling drone registration, medication loading, and battery monitoring.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Drone Models](#drone-models)
- [Drone States](#drone-states)
- [Business Rules](#business-rules)
- [Background Tasks](#background-tasks)
- [Development](#development)
- [Error Handling](#error-handling)
- [Support](#support)
- [Author](#author)

## Features

- Register new drones
- Load drones with medication items
- Fetch loaded medications for a drone
- Retrieve drones available for loading
- Check individual drone battery level
- Automatically log all drone battery levels every 10 minutes
- Prevents overloading drones beyond their capacity
- Prevents loading when battery is below 25%
- Input validation using Joi

## Architecture

```
├── controllers/     # Request handlers
├── services/       # Business logic
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Express middlewares
├── validations/    # Input validation schemas
├── utils/          # Utility functions
├── config/         # Configuration files
├── worker/         # Background tasks
└── seeder/         # Database seeding
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm

## Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| **Runtime**    | Node.js (ESM modules) |
| **Framework**  | Express.js            |
| **ORM**        | Sequelize             |
| **Database**   | PostgreSQL            |
| **Validation** | Joi                   |
| **Scheduler**  | node-cron             |
| **Logging**    | Winston               |
| **Code Style** | Prettier              |

## Setup & Installation

### 1. Clone and Install dependencies

```bash
git clone https://github.com/faruqoladunjoye/drone-systems.git
cd "drone-system"
npm install
```

### 2. Database Setup

Create a PostgreSQL database and configure environment variables:

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` file with your database configuration:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=drone_delivery
DB_USER=your_username
DB_PASSWORD=your_password
```

### 3. Initialize Database

```bash
# Seed the database with initial data
npm run seed
```

This will create:

- 10 drones (with random weights, models, and battery levels)
- Sample medications

### 4. Start the Application

```bash
# Development mode with auto-reload
npm run dev

# Or start normally
node index.js
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Base URL

```
http://localhost:3000/api/drones
```

### 1. Register Drone

```http
POST /api/drones
Content-Type: application/json

{
  "serialNumber": "DRONE022",
  "weightLimit": 194,
  "batteryCapacity": 80
}
```

**Response:**

```json
{
  "message": "Drone registered successfully",
  "status": "success",
  "responseTime": "10:19 PM",
  "data": {
    "id": "uuid",
    "serialNumber": "DRONE022",
    "model": "Lightweight",
    "weightLimit": 194,
    "batteryCapacity": 80,
    "state": "IDLE"
  }
}
```

### 2. Load Drone with Medications

```http
POST /api/drones/:id/load
Content-Type: application/json

{
  "medicationCodes": ["PARA_500", "AMOX_250", "IBU_200"]
}
```

**Response:**

```json
{
  "message": "Drone Loaded successfully",
  "status": "success",
  "responseTime": "11:04 AM",
  "data": {
    "drone": {
      "id": "uuid",
      "serialNumber": "DRONE001",
      "model": "Cruiserweight",
      "weightLimit": 400,
      "batteryCapacity": 100,
      "state": "LOADED",
      "medications": [...]
    },
    "totalWeight": 135
  }
}
```

### 3. Get Loaded Medications

```http
GET /api/drones/:id/medications
```

**Response:**

```json
{
  "message": "Medications fetched successfully",
  "status": "success",
  "responseTime": "3:12 PM",
  "data": [
    {
      "id": "uuid",
      "name": "Paracetamol-500",
      "weight": 50,
      "code": "PARA_500",
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

### 4. Get Available Drones

```http
GET /api/drones/available?page=1&limit=10
```

**Response:**

```json
{
  "message": "Available drones fetched successfully",
  "status": "success",
  "responseTime": "2:15 PM",
  "data": {
    "drones": [
      {
        "id": "uuid",
        "serialNumber": "DRONE001",
        "model": "Cruiserweight",
        "weightLimit": 400,
        "batteryCapacity": 100,
        "state": "IDLE"
      },
      {
        "id": "uuid",
        "serialNumber": "DRONE002",
        "model": "Middleweight",
        "weightLimit": 300,
        "batteryCapacity": 90,
        "state": "IDLE"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### 5. Get Drone Battery Level

```http
GET /api/drones/{droneId}/battery
```

**Response:**

```json
{
  "message": "Battery level fetched successfully",
  "status": "success",
  "responseTime": "10:08 PM",
  "data": {
    "droneId": "uuid",
    "serialNumber": "DRONE001",
    "batteryCapacity": 85
  }
}
```

## Drone Models

| Model         | Weight Limit |
| ------------- | ------------ |
| Lightweight   | ≤ 200g       |
| Middleweight  | ≤ 300g       |
| Cruiserweight | ≤ 400g       |
| Heavyweight   | ≤ 500g       |

## Drone States

| State      | Description            |
| ---------- | ---------------------- |
| IDLE       | Ready for loading      |
| LOADING    | Currently being loaded |
| LOADED     | Ready for delivery     |
| DELIVERING | In transit             |
| DELIVERED  | Delivery completed     |
| RETURNING  | Returning to base      |

## Business Rules

1. **Weight Limit**: Drones cannot be loaded beyond their weight capacity
2. **Battery Safety**: Drones with < 25% battery cannot be loaded
3. **Serial Number**: Must be unique across all drones
4. **Medication Codes**: Must contain only uppercase letters, numbers, and underscores
5. **Medication Names**: Must contain only letters, numbers, hyphens, and underscores

## Background Tasks

### Battery Monitoring

- **Frequency**: Every 10 minutes
- **Purpose**: Audit battery levels for all drones
- **Storage**: Logs stored in `batteryLog` table
- **Logging**: Winston logger with structured logging

## Development

### Project Structure

```
drone-system/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── package.json          # Dependencies and scripts
├── controllers/          # HTTP request handlers
│   └── drone.controller.js
├── services/            # Business logic layer
│   └── drone.service.js
├── models/              # Database models
│   ├── drone.model.js
│   ├── medication.model.js
│   ├── batteryLog.model.js
│   └── droneMedication.model.js
├── routes/              # API route definitions
│   ├── index.js
│   └── drone.route.js
├── middlewares/         # Express middlewares
│   ├── error.js
│   └── validate.js
├── validations/         # Joi validation schemas
│   └── drone.validation.js
├── utils/               # Utility functions
│   ├── ApiError.js
│   ├── catchAsync.js
│   ├── pick.js
│   └── response-wrapper.js
├── config/              # Configuration files
│   ├── logger.js
│   └── morgan.js
├── worker/              # Background tasks
│   └── battery.scheduler.js
└── seeder/              # Database seeding
    └── seed.js
```

## Error Handling

The API uses structured error responses:

```json
{
  "status": "error",
  "message": "Drone battery too low for loading (<25%)",
  "statusCode": 400
}
```

## Support

For issues and questions:

1. Check the logs
2. Verify database connection
3. Ensure all environment variables are set
4. Check if the seeder has run successfully

## Author

### Faruq Oladunjoye

---

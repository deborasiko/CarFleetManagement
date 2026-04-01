# Car Fleet Management System

A comprehensive full-stack application for managing vehicle fleet operations, including vehicles, drivers, fuel logs, maintenance, trips, expenses, and documents.

## 🚀 Quick Overview

**Car Fleet Management System** is built with:
- **Backend**: ASP.NET Core 8.0 with PostgreSQL
- **Frontend**: React 18 with Vite
- **Database**: PostgreSQL 15
- **Architecture**: Clean Architecture with Repository Pattern and Dependency Injection
- **Deployment**: Docker & Docker Compose support

## 📋 Features

- **Vehicle Management**: Track vehicles, their status, and assignments
- **Driver Management**: Manage drivers with license tracking and status
- **Fuel Logging**: Record fuel purchases with cost and consumption metrics
- **Maintenance**: Schedule and track service records
- **Trip Management**: Log trips with duration and distance tracking
- **Expense Tracking**: Monitor non-fuel expenses (insurance, tolls, parking, etc.)
- **Document Management**: Store and track important documents with expiration dates
- **Fleet Locations**: Geographic location tracking for vehicles
- **Responsive UI**: Modern React-based interface with real-time data updates

## 🏗️ Project Structure

```
carfleetmanagementproject/
├── carfleet-frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API integration
│   │   ├── styles/             # CSS stylesheets
│   │   └── utils/              # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── CarFleetManagement/         # .NET Core backend
│   ├── src/
│   │   ├── CarFleet.Api/       # API layer
│   │   │   ├── Controllers/    # REST endpoints
│   │   │   ├── Program.cs      # Configuration & DI setup
│   │   │   └── Dockerfile
│   │   └── CarFleet.Core/      # Business logic layer
│   │       ├── Models/         # Domain entities
│   │       ├── DTOs/           # Data Transfer Objects
│   │       ├── Repositories/   # Data access layer
│   │       ├── Services/       # Business logic
│   │       ├── Validators/     # Input validation
│   │       ├── Mapping/        # AutoMapper profiles
│   │       └── Data/           # DbContext & migrations
│   └── tests/                  # Unit tests
│
└── docker-compose.yml          # Multi-container orchestration
```

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL 15
- **ORM**: Entity Framework Core 8.0
- **Validation**: FluentValidation
- **API Documentation**: Swagger/OpenAPI
- **Mapping**: AutoMapper
- **Testing**: xUnit

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0
- **Routing**: React Router 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Linting**: ESLint

## 📦 Prerequisites

### For non-Docker setup:
- **.NET SDK 8.0** - [Download](https://dotnet.microsoft.com/download)
- **PostgreSQL 15** - [Download](https://www.postgresql.org/download/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager

### For Docker setup:
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (usually included with Docker Desktop)

## 🐳 Setup with Docker (Recommended)

### Step 1: Clone & Navigate to Project
```bash
cd carfleetmanagementproject
```

### Step 2: Start All Services
```bash
docker-compose up -d
```

This command will:
- Create and start a PostgreSQL database container
- Build and start the ASP.NET Core API backend
- Build and start the React frontend
- Automatically migrate the database and seed initial data

### Step 3: Access the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React web application |
| **API** | http://localhost:5000 | REST API endpoints |
| **API Swagger** | http://localhost:5000/swagger | API documentation |
| **Database** | localhost:5432 | PostgreSQL (local access only) |

### Step 4: Stop Services
```bash
docker-compose down
```

To also remove volumes:
```bash
docker-compose down -v
```

## 🏃 Setup Without Docker

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd CarFleetManagement
```

#### Step 2: Configure Database Connection

**Option A: Local PostgreSQL**
1. Ensure PostgreSQL is running on `localhost:5432`
2. Update connection string in `src/CarFleet.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=carfleet;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**Option B: Use Docker Database Only**
```bash
docker run -d \
  --name carfleet_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=carfleet \
  -p 5432:5432 \
  postgres:15
```

#### Step 3: Restore Dependencies
```bash
dotnet restore
```

#### Step 4: Run Database Migrations
```bash
cd src/CarFleet.Api
dotnet ef database update
```

#### Step 5: Start the API Server
```bash
dotnet run --urls http://localhost:5000
```

The API will be available at `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd carfleet-frontend
```

#### Step 2: Configure Environment Variables

Create `.env` file from `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
```

#### Step 3: Install Dependencies
```bash
npm install
```

#### Step 4: Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Step 5: Build for Production (Optional)
```bash
npm run build
```

## 📝 Database Schema Highlights

### Core Entities
- **Vehicles**: Fleet inventory with status tracking
- **Drivers**: Driver information with license management
- **VehicleAssignments**: Vehicle-to-driver assignments
- **FuelLogs**: Fuel consumption and cost tracking
- **ServiceRecords**: Maintenance and repair history
- **Trips**: Trip logging with distance and duration
- **Expenses**: Non-fuel expense tracking
- **Documents**: Important document management
- **FleetLocations**: Geographic location tracking

## 🔌 API Endpoints

### Sample Endpoints

```
GET    /api/vehicles              - List all vehicles
POST   /api/vehicles              - Create new vehicle
GET    /api/vehicles/{id}         - Get vehicle details
PUT    /api/vehicles/{id}         - Update vehicle
DELETE /api/vehicles/{id}         - Delete vehicle

GET    /api/drivers               - List all drivers
GET    /api/fuel-logs             - List fuel logs
GET    /api/fuel-logs/vehicle/{id}/average-consumption - Get avg consumption
POST   /api/trips                 - Create new trip
```

Full API documentation available at: `http://localhost:5000/swagger`

## 🔧 Environment Configuration

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=carfleet;Username=postgres;Password=postgres"
  }
}
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
```

## 🚨 Troubleshooting

### Backend Issues

**Error: "connection refused" for database**
- Ensure PostgreSQL is running on port 5432
- Check connection string in `appsettings.json`
- Try: `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15`

**Error: "dotnet: command not found"**
- Install .NET SDK 8.0: https://dotnet.microsoft.com/download
- Restart terminal after installation

**Error: "migrations not applied"**
```bash
cd src/CarFleet.Api
dotnet ef database update
```

### Frontend Issues

**Error: "Cannot find module" or dependency issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors when calling API**
- Ensure backend is running at `http://localhost:5000`
- Check `.env` file has correct `VITE_API_BASE_URL`
- Verify frontend origin is in CORS policy in backend `Program.cs`

**Port already in use**
- Frontend (5173): `npm run dev -- --port 5174`
- Backend (5000): `dotnet run --urls http://localhost:5001`

### Docker Issues

**Containers won't start**
```bash
docker-compose down -v
docker-compose up -d --build
```

**Database connection issues**
```bash
docker-compose logs db
docker-compose restart db
```

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core)
- [React Documentation](https://react.dev)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com)

## 📄 License

This project is provided as-is for educational and commercial purposes.

## 💡 Development Tips

- **Hot Reload**: Frontend automatically reloads on file changes (`npm run dev`)
- **API Testing**: Use Swagger UI at `/swagger` to test endpoints
- **Database Seeding**: Initial data is seeded automatically on first run
- **Logging**: Check console output for debugging information

---

**Last Updated**: March 31, 2026

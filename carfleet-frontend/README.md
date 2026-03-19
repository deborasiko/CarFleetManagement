# Car Fleet Management Frontend

A modern React-based frontend for managing vehicle fleets, drivers, trips, expenses, and related logistics.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── VehicleList.jsx
│   ├── VehicleForm.jsx
│   ├── DriverList.jsx
│   ├── DriverForm.jsx
│   ├── TripList.jsx
│   ├── TripForm.jsx
│   ├── ExpenseList.jsx
│   ├── ExpenseForm.jsx
│   ├── FuelLogList.jsx
│   ├── FuelLogForm.jsx
│   ├── ServiceRecordList.jsx
│   ├── ServiceRecordForm.jsx
│   ├── DocumentList.jsx
│   ├── DocumentForm.jsx
│   ├── VehicleAssignmentList.jsx
│   ├── VehicleAssignmentForm.jsx
│   ├── FleetLocationList.jsx
│   └── FleetLocationForm.jsx
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── VehiclesPage.jsx
│   ├── DriversPage.jsx
│   ├── TripsPage.jsx
│   ├── ExpensesPage.jsx
│   ├── FuelLogsPage.jsx
│   ├── ServiceRecordsPage.jsx
│   ├── DocumentsPage.jsx
│   ├── VehicleAssignmentsPage.jsx
│   └── FleetLocationsPage.jsx
├── services/            # API services
│   ├── apiService.js   # Axios configuration and API endpoints
│   └── useApi.js       # Custom hooks for API calls
├── styles/              # CSS stylesheets
│   ├── index.css
│   └── app.css
├── App.jsx             # Main app component with routing
└── main.jsx            # React entry point
```

## Features

- **Dashboard**: Overview with key statistics
- **Vehicle Management**: Add, edit, delete vehicles
- **Driver Management**: Manage driver information
- **Trip Tracking**: Create and manage trips
- **Expense Tracking**: Log fleet expenses
- **Fuel Logging**: Track fuel consumption
- **Service Records**: Maintain vehicle service history
- **Document Management**: Store vehicle and driver documents
- **Vehicle Assignments**: Assign vehicles to drivers
- **Fleet Locations**: Manage fleet depots/locations

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend connects to the CarFleetManagement backend API. Ensure the backend is running on `http://localhost:5000`.

API service configuration is in `src/services/apiService.js`. All endpoints are pre-configured to connect to the backend controllers.

## Architecture

- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Build tool and dev server

## Styling

The application uses a custom CSS framework with:
- Responsive grid layout
- Component-based styling
- Color-coded action buttons
- Mobile-friendly design

## Key Components

### Pages
Each page handles a specific resource and includes:
- Data fetching
- CRUD operations
- Error handling
- Loading states

### Forms
Reusable form components with:
- Input validation
- Edit/Create functionality
- Cancel operations
- Responsive layout

### Lists
Table-based display with:
- Edit and delete actions
- Empty state messages
- Responsive tables

## Connecting to the Backend

The frontend is pre-configured to connect to the backend. Make sure the backend API is running and configured to accept requests from the frontend domain/port.

Modify the `VITE_API_BASE_URL` in `.env` if the backend is running on a different port or domain.

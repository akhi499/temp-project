# Frontend-Backend Integration Guide

This guide explains how the new frontend (`uni-spark-admin-main`) has been connected to your existing Django backend (`university_dashboard`).

## What Was Done

### 1. API Service Layer (`src/lib/api.ts`)
- Created a centralized API service to communicate with the Django backend
- Defined TypeScript interfaces for all data models (Professor, Student, Academic, Publication)
- Implemented methods for fetching professors, students, and dashboard statistics
- Added support for filtering professors by publication date range

### 2. Updated Pages

#### Professors Page (`src/pages/Professors.tsx`)
- **Before**: Used mock data with hardcoded professor information
- **After**: Fetches real data from Django API endpoint `/api/professors/`
- **Features**:
  - Real-time search and filtering by department
  - Publication date range filtering (from your original dashboard)
  - Displays actual publication count and academic background
  - Loading states and error handling
  - Dynamic department dropdown populated from API data

#### Students Page (`src/pages/Students.tsx`)
- **Before**: Placeholder page with "coming soon" message
- **After**: Full implementation with real data from Django API
- **Features**:
  - Fetches students from `/api/students/` endpoint
  - Search and filter by branch code
  - Displays roll number, name, email, and branch
  - Loading states and error handling

#### Dashboard Page (`src/pages/Dashboard.tsx`)
- **Before**: Used hardcoded statistics
- **After**: Calculates real statistics from API data
- **Features**:
  - Real student count from database
  - Real professor count from database
  - Dynamic stats with loading states
  - Error handling with retry functionality

## How to Run

### 1. Start the Django Backend
```bash
cd university_dashboard
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/api/`

### 2. Start the Frontend
```bash
cd uni-spark-admin-main
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173/`

## API Endpoints Used

- `GET /api/professors/` - Fetch all professors with optional filtering
- `GET /api/students/` - Fetch all students
- `GET /api/professors/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Filter professors by publication date

## Key Features Migrated

1. **Publication Date Filtering**: The date range filtering from your original dashboard is now integrated into the new Professors page
2. **Real Data**: All pages now display actual data from your Django database
3. **Modern UI**: Maintained the beautiful shadcn/ui components while adding real functionality
4. **Error Handling**: Added proper loading states and error handling throughout
5. **Type Safety**: Full TypeScript support with proper interfaces

## Data Flow

```
Django Backend (Port 8000)
    ↓ REST API calls
API Service Layer (api.ts)
    ↓ React hooks
UI Components (Pages)
    ↓ User interactions
Back to API Service
```

## Next Steps

1. **Test the Integration**: Start both servers and verify data is loading correctly
2. **Add More Features**: You can now add more functionality like:
   - Add/Edit professors and students
   - View detailed professor profiles with publications
   - Export functionality
   - More advanced filtering options

3. **Customize**: Modify the UI components, add more pages, or extend the API as needed

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, make sure your Django backend has CORS headers configured
- **API Not Found**: Ensure the Django server is running on port 8000
- **Data Not Loading**: Check the browser console for API errors and verify the database has data

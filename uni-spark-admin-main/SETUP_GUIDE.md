# Setup Guide - Frontend Backend Integration

## Quick Start

### Option 1: Using Batch File (Recommended for Windows)
1. Double-click `start-frontend.bat` in the `uni-spark-admin-main` folder
2. This will automatically install dependencies and start the frontend

### Option 2: Manual Setup

#### 1. Start Django Backend
```bash
cd university_dashboard
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/api/`

#### 2. Start Frontend (Choose one method)

**Method A: Using Command Prompt**
```bash
cd uni-spark-admin-main
npm install
npm run dev
```

**Method B: Fix PowerShell Execution Policy**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd uni-spark-admin-main
npm install
npm run dev
```

## Testing the Connection

1. **Test API Directly**: Open `test-api.html` in your browser to test the Django API
2. **Test Frontend**: Open `http://localhost:5173/` in your browser

## Troubleshooting

### "Failed to fetch" Error
- ✅ **Fixed**: Updated CORS settings to allow `http://localhost:5173`
- ✅ **Fixed**: Moved CORS middleware to the top of middleware stack
- ✅ **Fixed**: Added `CORS_ALLOW_ALL_ORIGINS = True` for development

### PowerShell Execution Policy Error
- **Solution 1**: Use the batch file (`start-frontend.bat`)
- **Solution 2**: Use Command Prompt instead of PowerShell
- **Solution 3**: Change execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### "vite is not recognized" Error
- **Solution**: Run `npm install` first to install dependencies

## What's Working Now

✅ **API Service Layer**: Complete TypeScript API service  
✅ **Professors Page**: Real data with publication filtering  
✅ **Students Page**: Real data with search and filtering  
✅ **Dashboard**: Real statistics from database  
✅ **CORS Configuration**: Fixed to allow frontend-backend communication  
✅ **Error Handling**: Proper loading states and error messages  

## API Endpoints

- `GET /api/professors/` - Get all professors
- `GET /api/professors/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Filter by publication date
- `GET /api/students/` - Get all students

## Next Steps

1. **Test the Integration**: Make sure both servers are running and test the pages
2. **Add Sample Data**: If you don't have data, add some professors and students through Django admin
3. **Customize**: Modify the UI or add more features as needed

## File Structure

```
uni-spark-admin-main/
├── src/
│   ├── lib/
│   │   └── api.ts              # API service layer
│   ├── pages/
│   │   ├── Professors.tsx      # Updated with real data
│   │   ├── Students.tsx        # Complete implementation
│   │   └── Dashboard.tsx       # Real statistics
│   └── ...
├── start-frontend.bat          # Windows batch file to start frontend
├── test-api.html              # API connection test
└── SETUP_GUIDE.md             # This file
```

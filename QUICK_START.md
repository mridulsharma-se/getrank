# GetRank - Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Prerequisites
- Python 3.8+ (`python3 --version`)
- Node.js 16+ (`node --version`)
- macOS/Linux (for dev.sh) or Windows (for dev.bat)

### Option 1: Manual Setup (Recommended for First Time)

#### Terminal 1 - Start Backend
```bash
cd backend
source venv/bin/activate    # macOS/Linux
# python venv\Scripts\activate.bat  # Windows
pip install -r requirements.txt
python manage.py runserver 8000
```

You should see:
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
March 07, 2025 - 13:45:00
Django version 6.0.2, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
```

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm install  # only run if node_modules not yet installed
npm run dev
```

You should see:
```
> my-v0-project@0.1.0 dev > next dev
  ▲ Next.js 16.0.0
  - Local: http://localhost:3000
```

#### Terminal 3 - Test API
```bash
curl http://localhost:8000/api/health/
```

Expected response:
```json
{
  "status": "ok",
  "model_loaded": true,
  "message": "Backend is running"
}
```

### Option 2: Automated Startup

**macOS/Linux:**
```bash
cd /path/to/getrank
./dev.sh
```

**Windows:**
```bash
cd path\to\getrank
dev.bat
```

---

## 🌐 Using the Application

### 1. Open in Browser
- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:8000/api/**
- Health Check: **http://localhost:8000/api/health/**

### 2. Test with a Codeforces Handle
1. Go to http://localhost:3000
2. Enter a Codeforces username (e.g., `tourist`, `MikeMirzayanov`)
3. Click "Predict"
4. View the predicted rating change

### Example Handles to Test
- `tourist` - 3 stars (plenty of contests)
- `Gennady` - 3 stars
- `Benq` - 3 stars
- `Radewoosh` - 3 stars

---

## 📊 API Endpoints

### Health Check
```bash
curl http://localhost:8000/api/health/
```

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "message": "Backend is running"
}
```

### Get Prediction
```bash
curl -X POST http://localhost:8000/api/predict/ \
  -H "Content-Type: application/json" \
  -d '{
    "avg_rating_delta": -20.5,
    "best_gain": 150,
    "worst_loss": -200,
    "num_contests": 25,
    "recent_trend": -5.2
  }'
```

**Response:**
```json
{
  "predicted_rating_delta": -15.3
}
```

---

## 🔧 Troubleshooting

### Backend Issues

**Error: "No module named 'lightgbm'"**
```bash
cd backend
source venv/bin/activate
pip install lightgbm==4.1.0
```

**Error: "Port 8000 already in use"**
```bash
# Kill the process using port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Then start again:
python manage.py runserver 8000
```

**Error: "ModuleNotFoundError" after adding code**
```bash
# Restart both servers - Django auto-reloads on changes
# Just wait for "Restarting..." message
```

### Frontend Issues

**Error: "Port 3000 already in use"**
```bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Then start again:
npm run dev
```

**Blank page or errors on load**
```bash
# Check browser console (F12)
# Check that backend is running (health check should work)
# Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
```

**Dependencies not installing**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.yaml
npm install
npm run dev
```

### Connection Issues

**"Backend not responding"**
- Check backend is running: `curl http://localhost:8000/api/health/`
- Check CORS is enabled (should be by default in settings.py)
- Check frontend is trying correct URL: `http://localhost:8000`
- Check no firewall is blocking ports 3000 or 8000

**"Invalid handle" error**
- Make sure Codeforces handle exists
- Handle is case-sensitive on Codeforces
- Check internet connection (app needs to reach codeforces.com)

---

## 📁 Project Structure

```
getrank/
├── backend/
│   ├── manage.py              # Django management
│   ├── requirements.txt        # Python dependencies
│   ├── venv/                   # Virtual environment
│   ├── backend/
│   │   ├── settings.py         # Django configuration
│   │   └── urls.py             # Main routing
│   └── api/
│       ├── views.py            # API endpoints
│       ├── serializers.py      # Data validation
│       └── urls.py             # API routes
│
├── frontend/
│   ├── package.json            # Node dependencies
│   ├── node_modules/           # Installed packages
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   └── layout.tsx          # Layout
│   ├── components/             # UI components
│   └── services/
│       └── api.ts              # Backend integration
│
│   └── ml/
│       ├── rating_model.txt        # ML model
│       └── *.py                    # Training scripts
```

---

## 🛑 Stopping Servers

### From the Terminal
```bash
# Stop frontend (Ctrl+C in that terminal)
Ctrl+C

# Stop backend (Ctrl+C in that terminal)
Ctrl+C
```

### Using Terminal Commands
```bash
# Kill all Node processes
killall node

# Kill all Python processes (be careful!)
killall python
```

---

## 📚 Learn More

- **Full Setup Guide**: See [DEVELOPMENT.md](DEVELOPMENT.md)
- **Code Analysis**: See [CODE_REVIEW.md](CODE_REVIEW.md)
- **Project Overview**: See [README.md](README.md)
- **API Documentation**: See [DEVELOPMENT.md](DEVELOPMENT.md#api-endpoints)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000  
- [ ] Health check returns `status: "ok"`
- [ ] Can load http://localhost:3000
- [ ] Can enter a Codeforces handle
- [ ] Can get a prediction
- [ ] Browser console shows no errors
- [ ] Backend terminal shows requests

---

## 🚀 Next Steps

1. **Explore the UI** - Try different Codeforces handles
2. **Check API Docs** - Review [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Review Code** - See [CODE_REVIEW.md](CODE_REVIEW.md)
4. **Deploy** - Follow deployment guide in [DEVELOPMENT.md](DEVELOPMENT.md)

---

**Version**: 1.0  
**Last Updated**: March 7, 2026  
**Status**: ✅ Ready to Use

Happy predicting! 🎉

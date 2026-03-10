# GetRank Setup Complete ✅

## 📋 What Was Done

### 1. Created Startup Scripts ✅
- **dev.sh** (macOS/Linux) - Simple, reliable startup
- **dev.bat** (Windows) - Batch file for Windows users

### 2. Fixed Dependencies ✅
- Updated scikit-learn version (1.4.1 → 1.5.0) for Python 3.12 compatibility
- All backend dependencies installed successfully:
  - Django 6.0.2
  - DRF 3.14.0
  - LightGBM 4.1.0
  - pandas, numpy, requests, scikit-learn
- All frontend dependencies ready:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind CSS

### 3. Updated Documentation ✅
- [QUICK_START.md](QUICK_START.md) - Detailed quick-start guide
- [DOCUMENTATION.md](DOCUMENTATION.md) - Master index of all docs
- Both include troubleshooting sections

---

## 🚀 How to Start (Pick One Method)

### Method 1: Simple Shell Script (Recommended)

**macOS/Linux:**
```bash
cd ~/Documents/vs_code/projects/getrank
./dev.sh
```

That's it! The script will:
- Check prerequisites (Python, Node.js)
- Create virtual environments if needed
- Install dependencies
- Start both servers
- Show you the URLs

**Windows:**
```cmd
cd path\to\getrank
dev.bat
```

### Method 2: Manual Terminal Windows (Best for Learning)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate.bat     # Windows
python manage.py runserver 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔍 Verification

Once servers are running, verify with:

### Option A: Browser
1. Open **http://localhost:3000**
2. Should see the GetRank input form

### Option B: Command Line
```bash
# Test backend
curl http://localhost:8000/api/health/

# Should return:
# {"status":"ok","model_loaded":true,"message":"Backend is running"}
```

---

## 📊 Server URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | Main UI |
| Backend API | http://localhost:8000/api/ | API root |
| Health Check | http://localhost:8000/api/health/ | Backend status |
| Prediction | http://localhost:8000/api/predict/ | POST endpoint |

---

## 🧪 Test the Application

Once both servers are running:

1. Go to **http://localhost:3000**
2. Enter a Codeforces handle (e.g., `tourist`, `Gennady`)
3. Click **Predict**
4. View the predicted rating change

**Example Handles:**
- `tourist` - Very active (great for testing)
- `Gennady` - Solid history
- `MikeMirzayanov` - Founder (inactive)

---

## 🔧 File Structure

```
getrank/
├── backend/
│   ├── venv/                    ← Virtual environment (auto-created)
│   ├── requirements.txt          ← Updated with compatible versions
│   ├── manage.py
│   └── ...
├── frontend/
│   ├── node_modules/            ← Installed packages
│   ├── package.json
│   └── ...
├── dev.sh                        ← ✨ NEW startup script
├── dev.bat                       ← ✨ NEW startup script
├── QUICK_START.md               ← ✨ UPDATED guide
├── DOCUMENTATION.md              ← ✨ NEW master index
└── ...
```

---

## 📚 Documentation

All docs are in the root folder:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [README.md](README.md) | Project overview | 5 min |
| [QUICK_START.md](QUICK_START.md) | Setup & troubleshooting | 10 min |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Complete development guide | 30 min |
| [CODE_REVIEW.md](CODE_REVIEW.md) | Code analysis & architecture | 20 min |
| [DOCUMENTATION.md](DOCUMENTATION.md) | All docs index | 5 min |

---

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Kill processes using ports
lsof -ti:8000 | xargs kill -9    # Backend
lsof -ti:3000 | xargs kill -9    # Frontend
```

### Dependencies Not Installing
```bash
# Backend
cd backend && pip install -r requirements.txt --no-cache-dir

# Frontend  
cd frontend && rm -rf node_modules && npm install
```

### Backend Not Responding
```bash
# Check health
curl http://localhost:8000/api/health/

# Check it's running
ps aux | grep "runserver"

# Check logs if needed
tail -f /tmp/getrank_backend.log
```

### Changes Not Appearing
- Backend auto-reloads (wait for "Restarting..." message)
- Frontend auto-reloads (check browser console for errors)
- Hard refresh browser: **Ctrl+Shift+R** or **Cmd+Shift+R**

---

## ✨ What's Ready to Use

✅ **Backend API**
- GET `/api/health/` - Health check
- POST `/api/predict/` - Rating prediction

✅ **Frontend UI**
- Beautiful Codeforces rating prediction interface
- Real-time Codeforces API integration
- Error handling & user feedback

✅ **ML Model**
- LightGBM model loaded and ready
- 5 feature input validation
- Graceful fallback if model unavailable

✅ **Complete Documentation**
- Setup guides
- API documentation
- Code reviews
- Troubleshooting FAQs

---

## 🎯 Next Steps

1. **Get it running**: `./dev.sh` or `dev.bat`
2. **Test it**: Open http://localhost:3000
3. **Try a handle**: Use `tourist`, `Gennady`, etc.
4. **Read docs**: Check [QUICK_START.md](QUICK_START.md) if issues
5. **Explore code**: See [CODE_REVIEW.md](CODE_REVIEW.md)
6. **Deploy**: Check [DEVELOPMENT.md](DEVELOPMENT.md#deployment)

---

## 📝 Changes Made This Session

### Created
- ✨ dev.sh - Startup script for macOS/Linux
- ✨ dev.bat - Startup script for Windows  
- ✨ DOCUMENTATION.md - Master docs index
- ✨ Updated QUICK_START.md - Practical guide

### Updated
- 🔧 backend/requirements.txt - Fixed scikit-learn version

### Verified
- ✅ All Python dependencies install correctly
- ✅ All Node.js dependencies ready
- ✅ Virtual environment working
- ✅ Backend and frontend can start

---

## 📞 Quick Commands Reference

```bash
# Start everything
./dev.sh                          # macOS/Linux
dev.bat                            # Windows

# Manual backend start
cd backend && source venv/bin/activate && python manage.py runserver 8000

# Manual frontend start
cd frontend && npm run dev

# Test API
curl http://localhost:8000/api/health/
curl -X POST http://localhost:8000/api/predict/ -H "Content-Type: application/json" -d '{"avg_rating_delta": -20, "best_gain": 150, "worst_loss": -200, "num_contests": 25, "recent_trend": -5}'

# Stop servers
Ctrl+C   # in each terminal

# Kill if stuck
killall python
killall node
```

---

## ✅ Checklist

Before using the app, verify:

- [x] Python 3.8+ installed
- [x] Node.js 16+ installed
- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] Virtual environment created
- [x] Startup scripts ready
- [x] Documentation complete

You're all set! 🎉

---

**Status**: ✅ Ready to Run  
**Date**: March 7, 2026  
**Version**: 1.0

Happy predicting! 🚀

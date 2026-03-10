# GetRank 🏆

A full-stack application that predicts Codeforces rating changes using machine learning.

## 📁 Project Structure

```
getrank/
├── backend/                   # Django REST API
│   ├── api/                   # API application
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py           # API endpoints
│   │   └── admin.py
│   ├── backend/               # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                  # Next.js React application
│   ├── app/                   # Next.js pages & layout
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── handle-input.tsx
│   │   ├── rating-card.tsx
│   │   ├── confidence-bar.tsx
│   │   ├── rating-trend-chart.tsx
│   │   └── ...
│   ├── services/              # API services
│   │   └── api.ts
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── styles/                # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── postcss.config.mjs
│
│   ├── ml/                    # ML Model & Training
│   │   ├── rating_model.txt   # Pre-trained LightGBM model
│   │   ├── train_model.py     # Model training script
│   │   ├── predict_rating.py  # Prediction utilities
│   │   ├── build_features.py  # Feature engineering
│   │   ├── collect_data.py    # Data collection
│   │   ├── requirements.txt
│   │   ├── dataset.csv
│   │   ├── raw_data.csv
│   │   └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ & npm/pnpm (for frontend)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server (port 8000)
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server (port 3000)
npm run dev
# or
pnpm dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📊 Features

- 🔍 Search Codeforces handles
- 📈 Predict next rating with confidence scores
- 📊 View rating history charts
- 📉 See performance statistics (avg change, best gain, worst drop, consistency)
- ✨ Clean, responsive UI with Tailwind CSS

## 🤖 ML Model

- **Algorithm**: LightGBM (Light Gradient Boosting Machine)
- **Features**: User statistics (submissions, rating changes, contests, etc.)
- **Output**: Predicted rating delta
- **Model File**: `backend/ml/rating_model.txt`

## 🔌 API Endpoints

### POST `/api/predict/`
Predict rating change for a user.

**Request:**
```json
{
  "feature_1": value,
  "feature_2": value,
  ...
}
```

**Response:**
```json
{
  "predicted_rating_delta": 25.5
}
```

## 📚 Additional Documentation

See [SETUP.md](SETUP.md) for detailed setup instructions and troubleshooting.

## 🛠️ Tech Stack

### Backend
- Django 6.0
- Django REST Framework
- LightGBM
- Pandas, NumPy

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts (for charts)
- Shadcn UI (components)
- React Hook Form
- Zod (validation)

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Created by Mridul Sharma

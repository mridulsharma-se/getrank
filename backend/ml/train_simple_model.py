import pandas as pd
import numpy as np
import lightgbm as lgb
from pathlib import Path

"""
Create a simple LightGBM model trained on synthetic data
that predicts rating delta from 5 input features.

Input features:
- avg_rating_delta: Average rating change from contests
- best_gain: Best rating gain
- worst_loss: Worst rating drop (negative)
- num_contests: Number of contests
- recent_trend: Recent trend in rating change
"""

# Set random seed for reproducibility
np.random.seed(42)

# Generate synthetic training data
n_samples = 1000

# Create realistic synthetic data
data = {
    'avg_rating_delta': np.random.normal(0, 30, n_samples),
    'best_gain': np.random.exponential(80, n_samples),
    'worst_loss': -np.random.exponential(100, n_samples),
    'num_contests': np.random.randint(3, 100, n_samples),
    'recent_trend': np.random.normal(0, 25, n_samples),
}

df = pd.DataFrame(data)

# Calculate target: rating_delta
# Simple relationship: influenced by avg change, best gains, and recent trend
# More contests → more stable predictions
# Extreme losses → potential recovery
rating_delta = (
    df['avg_rating_delta'] * 0.5 +           # Average is important
    df['best_gain'] * 0.15 +                  # Good performance helps
    df['worst_loss'] * 0.1 +                  # Losses reduce confidence  
    df['recent_trend'] * 0.3 +                # Recent trend is important
    np.log1p(df['num_contests']) * 5 -       # More contests = more stable
    np.random.normal(0, 20, n_samples)        # Add noise
)

df['rating_delta'] = rating_delta

# Split data
from sklearn.model_selection import train_test_split
X = df.drop('rating_delta', axis=1)
y = df['rating_delta']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train LightGBM model
print("Training LightGBM model...")
model = lgb.LGBMRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    num_leaves=31,
    subsample=0.8,
    colsample_bytree=0.8,
    verbose=-1
)

model.fit(X_train, y_train)

# Evaluate
from sklearn.metrics import mean_absolute_error, r2_score
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model MAE: {mae:.2f}")
print(f"Model R²: {r2:.3f}")

# Save model
model_path = Path(__file__).parent / "rating_model.txt"
model.booster_.save_model(str(model_path))
print(f"✅ Model saved to {model_path}")

# Print feature importance
print("\nFeature Importance:")
for name, importance in zip(X.columns, model.feature_importances_):
    print(f"  {name}: {importance:.3f}")

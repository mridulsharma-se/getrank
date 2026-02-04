import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("dataset.csv")

X = df.drop(columns=["rating_delta"])
y = df["rating_delta"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = lgb.LGBMRegressor(
    n_estimators=1200,
    learning_rate=0.03,
    max_depth=7,
    subsample=0.8,
    colsample_bytree=0.8
)

model.fit(X_train, y_train)

pred = model.predict(X_test)
print("MAE (rating delta):", mean_absolute_error(y_test, pred))

model.booster_.save_model("rating_model.txt")
print("Model saved")
import lightgbm as lgb
import pandas as pd
import numpy as np

model = lgb.Booster(model_file="rating_model.txt")

def predict_rating(before_rating, rank, participants, solved, penalty):
    row = pd.DataFrame([{
        "before_rating": before_rating,
        "performance": 1 - rank / participants,
        "rank_percentile": rank / participants,
        "log_participants": np.log1p(participants),
        "rating_strength": before_rating / 3000,
        "solved": solved,
        "penalty": penalty,
        "solve_rate": solved / participants
    }])

    delta = model.predict(row)[0]
    return int(before_rating + delta)

if __name__ == "__main__":
    print(
        predict_rating(
            before_rating=1480,
            rank=1200,
            participants=8000,
            solved=4,
            penalty=320
        )
    )
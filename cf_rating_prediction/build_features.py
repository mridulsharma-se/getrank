import pandas as pd
import numpy as np

def main():
    df = pd.read_csv("raw_data.csv")

    df["performance"] = 1 - df["rank_percentile"]
    df["log_participants"] = np.log1p(df["participants"])
    df["rating_strength"] = df["before_rating"] / 3000
    df["solve_rate"] = df["solved"] / df["participants"]

    features = [
        "before_rating",
        "performance",
        "rank_percentile",
        "log_participants",
        "rating_strength",
        "solved",
        "penalty",
        "solve_rate"
    ]

    df = df[features + ["rating_delta"]]
    df.to_csv("dataset.csv", index=False)
    print("Saved dataset.csv")

if __name__ == "__main__":
    main()
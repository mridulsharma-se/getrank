import requests
import time
import pandas as pd
from tqdm import tqdm

BASE = "https://codeforces.com/api"

def get(url, params=None):
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()["result"]

def main():
    contests = get(f"{BASE}/contest.list")
    contests = [c for c in contests if c["phase"] == "FINISHED"]

    rows = []

    for contest in tqdm(contests[:80]):
        cid = contest["id"]

        try:
            standings = get(
                f"{BASE}/contest.standings",
                params={"contestId": cid, "showUnofficial": "false"}
            )
            rating_changes = get(
                f"{BASE}/contest.ratingChanges",
                params={"contestId": cid}
            )
        except:
            continue

        total = len(standings["rows"])

        # map handle -> rating change
        rating_map = {
            r["handle"]: (r["oldRating"], r["newRating"])
            for r in rating_changes
        }

        for r in standings["rows"]:
            try:
                handle = r["party"]["members"][0]["handle"]
                if handle not in rating_map:
                    continue

                old_rating, new_rating = rating_map[handle]

                rows.append({
                    "before_rating": old_rating,
                    "after_rating": new_rating,
                    "rating_delta": new_rating - old_rating,
                    "rank": r["rank"],
                    "participants": total,
                    "rank_percentile": r["rank"] / total,
                    "solved": r["points"],
                    "penalty": r["penalty"]
                })
            except:
                continue

        time.sleep(0.3)

    df = pd.DataFrame(rows)
    df.to_csv("raw_data.csv", index=False)
    print("Saved raw_data.csv with", len(df), "rows")

if __name__ == "__main__":
    main()
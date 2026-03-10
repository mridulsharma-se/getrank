# Project Status Update

## What is Working
1. **Machine Learning Model Structure:** The prediction engine is consolidated cleanly under `backend/ml/`.
2. **Backend Server (Django):** Computes LightGBM rating deltas on `http://localhost:8000/api/predict/`.
3. **Frontend Server (Next.js):** Bootstrapped and running perfectly without module panic on `http://localhost:3000/`.

## The Cloudflare/Codeforces Challenge
Currently, Codeforces has upgraded its WAF/Cloudflare to exclusively block strict Node.js backend fetch proxies, native python curls (`cffi_), and cloud-scrapers due to aggressive bot Turnstile triggers.

### The Solution: Direct Front-End API Polling
The codebase has been refactored back to rely entirely on standard `fetch()` mechanisms initiated by the *Client Browser*.
Because users will access this app explicitly inside their own web browsers (like Chrome/Safari) natively rendering Javascript, the CORS-enabled Codeforces fetches from `api.ts` will natively pass bot-verification checks, as opposed to failing Server-Side Next.js queries.

## Setup
To run the project, simply trigger the launch scripts as usual!
```bash
chmod +x dev.sh
./dev.sh
```

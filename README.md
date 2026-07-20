# OptiMap — Option Pricing Visualizer

An interactive web app for pricing European options and visualizing how their
price and P&L respond to changes in market conditions. Enter the parameters of
an option and instantly see its call/put value alongside heatmaps that sweep
across spot price and volatility.

**Live demo:** [option-pricing.vercel.app](https://option-pricing.vercel.app)

## Features

- Three pricing models: **Black-Scholes**, **Monte Carlo**, and **Binomial Tree**
- Side-by-side **call and put** pricing
- **Heatmaps** showing price (or P&L) sensitivity across a grid of spot prices
  and volatilities
- Toggle between **Price** and **P&L** views

## Tech stack

| Layer     | Technology                                             |
| --------- | ------------------------------------------------------ |
| Frontend  | React (Create React App + CRACO), Material UI, Plotly  |
| Backend   | Python (Flask + Gunicorn)                              |
| Pricing   | C++ (compiled binaries invoked by the API)             |
| Hosting   | Vercel (frontend) · Google Cloud Run (backend, Docker) |

The pricing engines are written in C++ for speed. The Flask API takes request
parameters, invokes the compiled binaries, and returns the results as JSON.

## Architecture

```
React (Vercel)  ──HTTP──▶  Flask API (Cloud Run)  ──subprocess──▶  C++ pricing binaries
```

## Local development

### Backend

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Compile the C++ pricing engines
g++ -O2 -o calculations/black_scholes calculations/BlackScholes.cpp
g++ -O2 -o calculations/monte_carlo  calculations/MonteCarlo.cpp
g++ -O2 -o calculations/binomial_tree calculations/BinomialTree.cpp

flask --app app run   # serves on http://127.0.0.1:5000
```

### Frontend

```bash
cd client
npm install

# Point the frontend at your backend
echo "REACT_APP_API_URL=http://127.0.0.1:5000" > .env

npm start   # serves on http://localhost:3000
```

## Deployment

- **Frontend** → Vercel. Root directory `client`, with `REACT_APP_API_URL` set
  to the backend URL as an environment variable.
- **Backend** → Google Cloud Run from [`server/Dockerfile`](server/Dockerfile),
  which recompiles the C++ binaries for Linux at image build time:

  ```bash
  cd server
  gcloud run deploy option-pricing-api --source . --region us-central1 --allow-unauthenticated --cpu-boost
  ```

  `--cpu-boost` gives the container extra CPU during startup, which shortens
  cold starts (the delay on the first request after the service has been idle).

## API

| Endpoint         | Method | Description                                        |
| ---------------- | ------ | -------------------------------------------------- |
| `/`              | GET    | Health check                                       |
| `/calculate-all` | POST   | Call + put prices and heatmaps in one request      |

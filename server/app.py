from flask import Flask, request, jsonify
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
import subprocess
import os

app = Flask(__name__)
CORS(app)

app_root = os.path.dirname(os.path.abspath(__file__))  # Gets the absolute path of the current script
BLACK_SCHOLES_BINARY = os.path.join(app_root, 'calculations', 'black_scholes')
MONTE_CARLO_BINARY = os.path.join(app_root, 'calculations', 'monte_carlo')
BINOMIAL_TREE_BINARY = os.path.join(app_root, 'calculations', 'binomial_tree')



@app.route('/')
def home():
    return 'Option Pricing API is running! Thanks for checking it out!'

def compute_option_results(binary, option_type, spot_prices, volatilities, S, K, T, r, sigma, view):
    """Compute the exact option price plus the full heatmap grid for one option type."""
    # Exact price at the user's spot/volatility (also the P&L reference price)
    price_args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), "price", "0"]
    price_result = subprocess.run(price_args, capture_output=True, text=True)
    if price_result.returncode != 0:
        raise RuntimeError(price_result.stderr)
    price = float(price_result.stdout.strip())

    reference_price = price if view == "P&L" else 0.0

    spots_csv = ",".join(str(s) for s in spot_prices)
    vols_csv = ",".join(str(v) for v in volatilities)
    grid_args = [binary, "grid", option_type, spots_csv, str(K), str(T), str(r), vols_csv, view, str(reference_price)]
    grid_result = subprocess.run(grid_args, capture_output=True, text=True)
    if grid_result.returncode != 0:
        raise RuntimeError(grid_result.stderr)

    heatmap = [
        [round(float(value), 2) for value in line.split(",")]
        for line in grid_result.stdout.strip().splitlines()
    ]
    return {"price": round(price, 2), "heatmap": heatmap}

@app.route('/calculate-all', methods=['POST'])
def calculate_all():
    """Compute call+put prices and heatmaps in a single request."""
    try:
        data = request.json
        spot_prices = data.get('spotPrices', [])
        volatilities = data.get('volatilities', [])
        S = data.get('spotPrice')
        sigma = data.get('volatility')
        T = data.get('timeToMaturity', 1)
        K = data.get('strikePrice', 100)
        r = data.get('riskFreeRate')
        model = data.get('modelType', 'Black-Scholes')
        view = data.get('viewType', 'price')

        if not spot_prices or not volatilities:
            return jsonify({"error": "Missing required spotPrices or volatilities"}), 400
        if S is None or sigma is None:
            return jsonify({"error": "Missing required spotPrice or volatility"}), 400

        binaries = {
            'Black-Scholes': BLACK_SCHOLES_BINARY,
            'Monte Carlo': MONTE_CARLO_BINARY,
            'Binomial': BINOMIAL_TREE_BINARY,
        }
        binary = binaries.get(model)
        if binary is None:
            return jsonify({"error": "Invalid model type"}), 400

        # Price call and put concurrently
        with ThreadPoolExecutor(max_workers=2) as executor:
            call_future = executor.submit(
                compute_option_results, binary, "call", spot_prices, volatilities, S, K, T, r, sigma, view)
            put_future = executor.submit(
                compute_option_results, binary, "put", spot_prices, volatilities, S, K, T, r, sigma, view)
            call_results = call_future.result()
            put_results = put_future.result()

        return jsonify({"call": call_results, "put": put_results})

    except RuntimeError as e:
        return jsonify({"error": "Error executing the C++ program", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
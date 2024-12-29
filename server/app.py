from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

# Path to the compiled C++ binary
BLACK_SCHOLES_BINARY = "./calculations/black_scholes"  # Ensure this path points to your compiled C++ program

@app.route('/heatmap-data', methods=['POST'])
def heatmap_data():
    try:
        data = request.json
        spot_prices = data.get('spotPrices', [])
        volatilities = data.get('volatilities', [])
        T = data.get('timeToMaturity', 1)  # Default 1 year
        K = data.get('strikePrice', 100)   # Default strike price
        r = 0.05  # Risk-free interest rate
        option_type = data.get('optionType', 'call')  # Default to call option
        if not spot_prices or not volatilities:
            return jsonify({"error": "Missing required spotPrices or volatilities"}), 400

        heatmap_results = []

        for S in spot_prices:
            row = []
            for sigma in volatilities:
                # Call the C++ binary for each combination
                result = subprocess.run(
                    [BLACK_SCHOLES_BINARY, option_type, str(S), str(K), str(T), str(r), str(sigma)],
                    capture_output=True,
                    text=True
                )
                if result.returncode != 0:
                    return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500
                
                # Parse and append the result
                price = result.stdout.strip()
                row.append(price)
            heatmap_results.append(row)
        return jsonify({"heatmap": heatmap_results})

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/option-price', methods=['POST'])
def calculate():
    try:
        # Parse incoming JSON data
        data = request.json
        S = data.get('spotPrice')  # Current stock price
        K = data.get('strikePrice')  # Strike price
        T = data.get('timeToMaturity')  # Time to maturity (in years)
        r = 0.05  # Risk-free interest rate
        sigma = data.get('volatility')  # Volatility
        option_type = data.get('optionType', 'call')  # Default to call option
        if not all([S, K, T, r, sigma]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Call the C++ binary with the parameters
        result = subprocess.run(
            [BLACK_SCHOLES_BINARY, option_type, str(S), str(K), str(T), str(r), str(sigma)],
            capture_output=True,
            text=True
        )
        # Check for errors
        if result.returncode != 0:
            return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500

        # Parse the output from the C++ binary
        output = result.stdout.strip()

        return jsonify({"option_price": output})

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
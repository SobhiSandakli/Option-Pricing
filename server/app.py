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
    print("heatmap_data")
    try:
        data = request.json
        spot_prices = data.get('spotPrices', [])
        volatilities = data.get('volatilities', [])
        T = data.get('timeToMaturity', 1)  # Default 1 year
        K = data.get('strikePrice', 100)   # Default strike price
        r = 0.05  # Risk-free interest rate
        if not spot_prices or not volatilities:
            return jsonify({"error": "Missing required spotPrices or volatilities"}), 400

        heatmap_results = []

        for S in spot_prices:
            row = []
            for sigma in volatilities:
                # Call the C++ binary for each combination
                print(f"S: {S}, K: {K}, T: {T}, r: {r}, sigma: {sigma}")
                result = subprocess.run(
                    [BLACK_SCHOLES_BINARY, str(S), str(K), str(T), str(r), str(sigma)],
                    capture_output=True,
                    text=True
                )
                print(f"result in heatmap: {result}")
                if result.returncode != 0:
                    return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500
                
                # Parse and append the result
                price = result.stdout.strip()
                print(f"price: {price}")
                row.append(price)
            heatmap_results.append(row)
        print(f"heatmap_results: {heatmap_results}")
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
        print(f"S: {S}, K: {K}, T: {T}, r: {r}, sigma: {sigma}")
        if not all([S, K, T, r, sigma]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Call the C++ binary with the parameters
        result = subprocess.run(
            [BLACK_SCHOLES_BINARY, str(S), str(K), str(T), str(r), str(sigma)],
            capture_output=True,
            text=True
        )
        print(f"result in /option-price: {result}")
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

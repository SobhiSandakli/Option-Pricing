from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

BLACK_SCHOLES_BINARY = "./calculations/black_scholes"  # Ensure this path points to your compiled C++ program
MONTE_CARLO_BINARY = "./calculations/monte_carlo"  # Ensure this path points to your compiled C++ program
BINOMIAL_TREE_BINARY = "./calculations/binomial_tree"  # Ensure this path points to your compiled C++ program

@app.route('/heatmap-data', methods=['POST'])
def heatmap_data():
    try:
        data = request.json
        spot_prices = data.get('spotPrices', [])
        volatilities = data.get('volatilities', [])
        T = data.get('timeToMaturity', 1)  # Default 1 year
        K = data.get('strikePrice', 100)   # Default strike price
        r = data.get('riskFreeRate')  # Risk-free interest rate
        option_type = data.get('optionType', 'call')  # Default to call option
        model = data.get('modelType', 'black_scholes')  # Default to Black-Scholes model
        view = data.get('viewType', 'price')  # Default to price view

        if not spot_prices or not volatilities:
            return jsonify({"error": "Missing required spotPrices or volatilities"}), 400

        heatmap_results = []

        print(f"Calculating heatmap data for {option_type} option using {model} model")
        for S in spot_prices:
            row = []
            for sigma in volatilities:
                # Determine the binary to call based on the model type
                if model == 'Black-Scholes':
                    binary = BLACK_SCHOLES_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
                elif model == 'Monte Carlo':
                    binary = MONTE_CARLO_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
                elif model == 'Binomial':
                    binary = BINOMIAL_TREE_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
                else:
                    return jsonify({"error": "Invalid model type"}), 400

                # Call the C++ binary for each combination
                result = subprocess.run(args, capture_output=True, text=True)
                if result.returncode != 0:
                    return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500
                
                # Parse and append the result
                price = round(float(result.stdout.strip()), 2)
                row.append(price)
            heatmap_results.append(row)
        print(f"heatmap results: {heatmap_results} for {option_type} option using {model} model")
        return jsonify({"heatmap": heatmap_results})

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/option-price', methods=['POST'])
def calculate():
    try:
        data = request.json
        S = data.get('spotPrice')
        K = data.get('strikePrice')
        T = data.get('timeToMaturity')
        r = data.get('riskFreeRate')
        sigma = data.get('volatility')
        option_type = data.get('optionType', 'call')
        model = data.get('modelType', 'black_scholes')

        if not all([S, K, T, r, sigma]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Determine the binary to call based on the model type
        if model == 'Black-Scholes':
            binary = BLACK_SCHOLES_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
        elif model == 'Monte Carlo':
            binary = MONTE_CARLO_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
        elif model == 'Binomial':
            binary = BINOMIAL_TREE_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma)]
        else:
            return jsonify({"error": "Invalid model type"}), 400

        # Call the C++ binary
        result = subprocess.run(args, capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500

        # Parse and return the result
        price = round(float(result.stdout.strip()), 2)
        return jsonify({"option_price": price})

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
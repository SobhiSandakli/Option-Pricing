from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

import os

app_root = os.path.dirname(os.path.abspath(__file__))  # Gets the absolute path of the current script
BLACK_SCHOLES_BINARY = os.path.join(app_root, 'calculations', 'black_scholes')
MONTE_CARLO_BINARY = os.path.join(app_root, 'calculations', 'monte_carlo')
BINOMIAL_TREE_BINARY = os.path.join(app_root, 'calculations', 'binomial_tree')



@app.route('/')
def home():
    return 'The api.optimap.ca is running! Thanks for checking it out! \n Check out optimap.ca for more information.'

@app.route('/heatmap-data', methods=['POST'])
def heatmap_data():

    try:
        data = request.json
        spot_prices = data.get('spotPrices', [])
        volatilities = data.get('volatilities', [])
        T = data.get('timeToMaturity', 1)
        K = data.get('strikePrice', 100)
        r = data.get('riskFreeRate')
        option_type = data.get('optionType', 'call')
        model = data.get('modelType', 'black_scholes')
        view = data.get('viewType', 'price')
        if not spot_prices or not volatilities:
            return jsonify({"error": "Missing required spotPrices or volatilities"}), 400

        # Compute reference_price only if we are using P&L view 
        # and have at least 4 values for spot_prices/volatilities.
        reference_price = 0.0
        if view == "P&L" and len(spot_prices) > 3 and len(volatilities) > 3:
            # Use spot_prices[3] and volatilities[3] to compute the reference price once
            ref_spot = spot_prices[3]
            ref_vol = volatilities[3]

            # Determine the binary based on the model
            if model == 'Black-Scholes':
                binary = BLACK_SCHOLES_BINARY
                ref_args = [binary, option_type, str(ref_spot), str(K), str(T), str(r), str(ref_vol), view, "0"]
            elif model == 'Monte Carlo':
                binary = MONTE_CARLO_BINARY
                ref_args = [binary, option_type, str(ref_spot), str(K), str(T), str(r), str(ref_vol), view, "0"]
            elif model == 'Binomial':
                binary = BINOMIAL_TREE_BINARY
                ref_args = [binary, option_type, str(ref_spot), str(K), str(T), str(r), str(ref_vol), view, "0"]
            else:
                return jsonify({"error": "Invalid model type"}), 400

            ref_result = subprocess.run(ref_args, capture_output=True, text=True)
            if ref_result.returncode != 0:
                return jsonify({"error": "Error computing reference price", "details": ref_result.stderr}), 500
            
            reference_price = float(ref_result.stdout.strip())

        heatmap_results = []

        for S in spot_prices:
            row = []
            for sigma in volatilities:
                # Build arguments
                if model == 'Black-Scholes':
                    binary = BLACK_SCHOLES_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, str(reference_price)]
                elif model == 'Monte Carlo':
                    binary = MONTE_CARLO_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, str(reference_price)]
                elif model == 'Binomial':
                    binary = BINOMIAL_TREE_BINARY
                    args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, str(reference_price)]
                else:
                    return jsonify({"error": "Invalid model type"}), 400

                # Call the C++ binary
                result = subprocess.run(args, capture_output=True, text=True)
                if result.returncode != 0:
                    return jsonify({"error": "Error executing the C++ program", "details": result.stderr}), 500

                price = round(float(result.stdout.strip()), 2)
                row.append(price)

            heatmap_results.append(row)

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
        view = data.get('viewType', 'price')

        if not all([S, K, T, r, sigma]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Determine the binary to call based on the model type
        if model == 'Black-Scholes':
            binary = BLACK_SCHOLES_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, "0"]
        elif model == 'Monte Carlo':
            binary = MONTE_CARLO_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, "0"]
        elif model == 'Binomial':
            binary = BINOMIAL_TREE_BINARY
            args = [binary, option_type, str(S), str(K), str(T), str(r), str(sigma), view, "0"]
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
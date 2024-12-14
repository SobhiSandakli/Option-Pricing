from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

# Path to the compiled C++ binary
BLACK_SCHOLES_BINARY = "./calculations/black_scholes"  # Ensure this path points to your compiled C++ program

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
        print(f"result: {result}")
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

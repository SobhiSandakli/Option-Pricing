#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm> // For std::max
#include <string>

double binomialOptionPricing(int N, double S0, double K, double r, double T, double sigma, bool isCall) {
    // Calculate derived parameters
    double dt = T / N; // Time step
    double u = exp(sigma * sqrt(dt)); // Up factor
    double d = 1 / u; // Down factor
    double p = (exp(r * dt) - d) / (u - d); // Risk-neutral probability

    // Create a vector to hold option values at the final nodes
    std::vector<double> optionValues(N + 1);

    // Calculate the option value at maturity
    for (int j = 0; j <= N; ++j) {
        double ST = S0 * pow(u, j) * pow(d, N - j); // Stock price at node (N, j)
        optionValues[j] = isCall ? std::max(0.0, ST - K) : std::max(0.0, K - ST); // Payoff at maturity
    }

    // Step back through the tree
    for (int i = N - 1; i >= 0; --i) {
        for (int j = 0; j <= i; ++j) {
            optionValues[j] = (p * optionValues[j + 1] + (1 - p) * optionValues[j]) * exp(-r * dt);
        }
    }

    return optionValues[0];
}

int main(int argc, char* argv[]) {
    // Adjust the number of expected parameters:
    // <option_type> <S0> <K> <T> <r> <sigma> <view> <reference_price>
    if (argc != 9) {
        std::cerr << "Usage: " << argv[0] 
                  << " <option_type> <S0> <K> <T> <r> <sigma> <view> <reference_price>\n";
        std::cerr << "  option_type: call or put\n";
        std::cerr << "  S0: Current stock price\n";
        std::cerr << "  K: Strike price\n";
        std::cerr << "  T: Time to maturity (in years)\n";
        std::cerr << "  r: Risk-free interest rate\n";
        std::cerr << "  sigma: Volatility\n";
        std::cerr << "  view: price or P&L\n";
        std::cerr << "  reference_price: reference option price for P&L\n";
        return 1;
    }

    std::string option_type = argv[1];
    double S0 = std::stod(argv[2]);
    double K = std::stod(argv[3]);
    double T = std::stod(argv[4]);
    double r = std::stod(argv[5]);
    double sigma = std::stod(argv[6]);
    std::string view = argv[7];
    double reference_price = std::stod(argv[8]);
    int N = 100; // Number of time steps

    bool isCall = (option_type == "call");
    if (option_type != "call" && option_type != "put") {
        std::cerr << "Invalid option type. Use 'call' or 'put'.\n";
        return 1;
    }

    double price = binomialOptionPricing(N, S0, K, r, T, sigma, isCall);

    // If we're in P&L view, subtract the reference price
    if (view == "P&L") {
        price = price - reference_price;
    }

    std::cout << price << std::endl;
    return 0;
}
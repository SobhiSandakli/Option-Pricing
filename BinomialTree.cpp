#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm> // For std::max

void printVector(const std::vector<double>& vec) {
    for (double value : vec) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
}

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
        printVector(optionValues);
    }

    std::cout << std::endl;
    // Backward induction to calculate the option price at the root
    for (int i = N - 1; i >= 0; --i) {
        for (int j = 0; j <= i; ++j) {
            std::cout << "i: " << i << " j: " << j << std::endl;
            optionValues[j] = exp(-r * dt) * (p * optionValues[j + 1] + (1 - p) * optionValues[j]);
            printVector(optionValues);

        }
    }

    // The option price at the root node (0, 0)
    return optionValues[0];
}

int main() {
    // Parameters
    int N = 10; // Number of time steps
    double S0 = 100.0; // Initial stock price
    double K = 105.0; // Strike price
    double r = 0.1; // Risk-free interest rate
    double T = 1; // Time to maturity (1 year)
    double sigma = 0.1; // Volatility
    bool isCall = true; // True for call, false for put

    // Calculate option price
    double optionPrice = binomialOptionPricing(N, S0, K, r, T, sigma, isCall);

    // Output the result
    std::cout << "Option Price: " << optionPrice << std::endl;

    return 0;
}

#include <iostream>
#include <cmath>
#include <random>
#include <vector>

double monteCarloEuropeanCall(
    double S0,        // Initial stock price
    double K,         // Strike price
    double r,         // Risk-free interest rate
    double T,         // Time to maturity
    double sigma,     // Volatility
    int numSimulations // Number of Monte Carlo simulations
) {
    // Random number generator for normal distribution
    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<> normalDist(0.0, 1.0);

    double totalPayoff = 0.0;

    for (int i = 0; i < numSimulations; ++i) {
        // Generate a random normal value
        double Z = normalDist(gen);

        // Simulate the stock price at time T
        double ST = S0 * std::exp((r - 0.5 * sigma * sigma) * T + sigma * std::sqrt(T) * Z);

        // Calculate the payoff for a European call option
        double payoff = std::max(ST - K, 0.0);

        // Accumulate the payoff
        totalPayoff += payoff;
    }

    // Calculate the discounted average payoff
    double optionPrice = (totalPayoff / numSimulations) * std::exp(-r * T);
    return optionPrice;
}

// Standard normal cumulative distribution function
double norm_cdf(double x) {
    return 0.5 * erfc(-x * std::sqrt(0.5));
}

// Black-Scholes formula for a European call option
double black_scholes_call(double S, double K, double T, double r, double sigma) {
    double d1 = (std::log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * std::sqrt(T));
    double d2 = d1 - sigma * std::sqrt(T);

    double call_price = S * norm_cdf(d1) - K * std::exp(-r * T) * norm_cdf(d2);
    return call_price;
}

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
    }

    std::cout << std::endl;
    // Backward induction to calculate the option price at the root
    for (int i = N - 1; i >= 0; --i) {
        for (int j = 0; j <= i; ++j) {
            optionValues[j] = exp(-r * dt) * (p * optionValues[j + 1] + (1 - p) * optionValues[j]);

        }
    }

    // The option price at the root node (0, 0)
    return optionValues[0];
}

int main() {
    // Input parameters
    double S0 = 186.53;          // Initial stock price
    double K = 100;           // Strike price
    double r = 0.0425;            // Risk-free interest rate (5%)
    double T = 3/365;             // Time to maturity (1 year)
    double sigma = 4.63;         // Volatility (20%)
    int numSimulations = 1000000; // Number of simulations

    // Calculate the option price using Monte Carlo
    double optionPrice = monteCarloEuropeanCall(S0, K, r, T, sigma, numSimulations);

    // Output the result
    std::cout << "European Call Option Price (Monte Carlo): " << optionPrice << std::endl;

    // Calculate call option
    double call_price = black_scholes_call(S0, K, T, r, sigma);

    // Output the result
    std::cout << "European Call Option Price (Black-Scholes): " << call_price << std::endl;

    // Parameters
    int N = 100; // Number of time steps
    double optionPriceBinomial = binomialOptionPricing(N, S0, K, r, T, sigma, true);

    // Output the result
    std::cout << "European Call Option Price (Binomial Tree): " << optionPriceBinomial << std::endl;
}
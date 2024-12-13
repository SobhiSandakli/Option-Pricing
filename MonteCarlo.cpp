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

int main() {
    // Input parameters
    double S0 = 70;          // Initial stock price
    double K = 60;           // Strike price
    double r = 0.1;            // Risk-free interest rate (5%)
    double T = 1.0;             // Time to maturity (1 year)
    double sigma = 0.2;         // Volatility (20%)
    int numSimulations = 1000000; // Number of simulations

    // Calculate the option price using Monte Carlo
    double optionPrice = monteCarloEuropeanCall(S0, K, r, T, sigma, numSimulations);

    // Output the result
    std::cout << "European Call Option Price: " << optionPrice << std::endl;

    return 0;
}

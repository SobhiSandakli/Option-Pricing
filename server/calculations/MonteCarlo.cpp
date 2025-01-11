#include <iostream>
#include <cmath>
#include <random>
#include <string>

// Monte Carlo simulation for a European call option
double monte_carlo_call(double S, double K, double T, double r, double sigma, int numSimulations, unsigned int seed) {
    std::mt19937 gen(seed);
    std::normal_distribution<> normalDist(0.0, 1.0);

    double totalPayoff = 0.0;

    for (int i = 0; i < numSimulations; ++i) {
        double Z = normalDist(gen);
        double ST = S * std::exp((r - 0.5 * sigma * sigma) * T + sigma * std::sqrt(T) * Z);
        double payoff = std::max(ST - K, 0.0);
        totalPayoff += payoff;
    }

    double optionPrice = (totalPayoff / numSimulations) * std::exp(-r * T);
    return optionPrice;
}

// Monte Carlo simulation for a European put option
double monte_carlo_put(double S, double K, double T, double r, double sigma, int numSimulations, unsigned int seed) {
    std::mt19937 gen(seed);
    std::normal_distribution<> normalDist(0.0, 1.0);

    double totalPayoff = 0.0;

    for (int i = 0; i < numSimulations; ++i) {
        double Z = normalDist(gen);
        double ST = S * std::exp((r - 0.5 * sigma * sigma) * T + sigma * std::sqrt(T) * Z);
        double payoff = std::max(K - ST, 0.0);
        totalPayoff += payoff;
    }

    double optionPrice = (totalPayoff / numSimulations) * std::exp(-r * T);
    return optionPrice;
}

int main(int argc, char* argv[]) {
    // Adjust the number of expected parameters:
    // <option_type> <S> <K> <T> <r> <sigma> <view> <reference_price>
    if (argc != 9) {
        std::cerr << "Usage: " << argv[0] 
                  << " <option_type> <S> <K> <T> <r> <sigma> <view> <reference_price>\n";
        std::cerr << "  option_type: call or put\n";
        std::cerr << "  S: Current stock price\n";
        std::cerr << "  K: Strike price\n";
        std::cerr << "  T: Time to maturity (in years)\n";
        std::cerr << "  r: Risk-free interest rate\n";
        std::cerr << "  sigma: Volatility\n";
        std::cerr << "  view: price or P&L\n";
        std::cerr << "  reference_price: reference option price for P&L\n";
        return 1;
    }

    std::string option_type = argv[1];
    double S = std::stod(argv[2]);
    double K = std::stod(argv[3]);
    double T = std::stod(argv[4]);
    double r = std::stod(argv[5]);
    double sigma = std::stod(argv[6]);
    std::string view = argv[7];
    double reference_price = std::stod(argv[8]);
    int numSimulations = 10000;
    unsigned int seed = 42; // Fixed seed for reproducibility

    double price;
    if (option_type == "call") {
        price = monte_carlo_call(S, K, T, r, sigma, numSimulations, seed);
    } else if (option_type == "put") {
        price = monte_carlo_put(S, K, T, r, sigma, numSimulations, seed);
    } else {
        std::cerr << "Invalid option type. Use 'call' or 'put'.\n";
        return 1;
    }

    // If we're in P&L view, subtract the reference price
    if (view == "P&L") {
        price = price - reference_price;
    }

    std::cout << price << std::endl;
    return 0;
}
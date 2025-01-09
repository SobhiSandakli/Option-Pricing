#include <iostream>
#include <cmath>
#include <random>
#include <string>

// Monte Carlo simulation for a European call option
double monte_carlo_call(double S, double K, double T, double r, double sigma, int numSimulations) {
    std::random_device rd;
    std::mt19937 gen(rd());
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
double monte_carlo_put(double S, double K, double T, double r, double sigma, int numSimulations) {
    std::random_device rd;
    std::mt19937 gen(rd());
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
    // Check if the correct number of parameters is passed
    if (argc != 7) {
        std::cerr << "Usage: " << argv[0] << " <option_type> <S> <K> <T> <r> <sigma> <numSimulations>\n";
        std::cerr << "  option_type: call or put\n";
        std::cerr << "  S: Current stock price\n";
        std::cerr << "  K: Strike price\n";
        std::cerr << "  T: Time to maturity (in years)\n";
        std::cerr << "  r: Risk-free interest rate\n";
        std::cerr << "  sigma: Volatility\n";
        return 1;
    }

    std::string option_type = argv[1];
    double S = std::stod(argv[2]);
    double K = std::stod(argv[3]);
    double T = std::stod(argv[4]);
    double r = std::stod(argv[5]);
    double sigma = std::stod(argv[6]);
    int numSimulations = 10000;

    double price;
    if (option_type == "call") {
        price = monte_carlo_call(S, K, T, r, sigma, numSimulations);
    } else if (option_type == "put") {
        price = monte_carlo_put(S, K, T, r, sigma, numSimulations);
    } else {
        std::cerr << "Invalid option type. Use 'call' or 'put'.\n";
        return 1;
    }

    std::cout << price << std::endl;
    return 0;
}
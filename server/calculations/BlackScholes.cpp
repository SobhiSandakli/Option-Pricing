#include <iostream>
#include <string>
#include <sstream>
#include <cmath>

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

int main(int argc, char* argv[]) {
    // Check if the correct number of parameters is passed
    if (argc != 6) {
        std::cerr << "Usage: " << argv[0] << " <S> <K> <T> <r> <sigma>\n";
        std::cerr << "  S: Current stock price\n";
        std::cerr << "  K: Strike price\n";
        std::cerr << "  T: Time to maturity (in years)\n";
        std::cerr << "  r: Risk-free interest rate (decimal)\n";
        std::cerr << "  sigma: Volatility (decimal)\n";
        return 1;
    }

    // Parse input parameters
    double S = std::stod(argv[1]);      // Current stock price
    double K = std::stod(argv[2]);      // Strike price
    double T = std::stod(argv[3]);      // Time to maturity
    double r = std::stod(argv[4]);      // Risk-free interest rate
    double sigma = std::stod(argv[5]);  // Volatility

    // Perform the Black-Scholes calculation
    double call_price = black_scholes_call(S, K, T, r, sigma);

    // Output the result
    std::cout << call_price << std::endl;

    return 0;
}

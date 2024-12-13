#include <iostream>
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

int main() {
    double S = 70;    // Current stock price
    double K = 60;    // Strike price
    double T = 2;    // Time to maturity (in years)
    double r = 0.1;    // Risk-free interest rate (as a decimal)
    double sigma = 0.2; // Volatility (as a decimal)

    // Calculate call option price
    double call_price = black_scholes_call(S, K, T, r, sigma);

    // Output the result
    std::cout << "The price of the European call option is: " << call_price << std::endl;

    return 0;
}

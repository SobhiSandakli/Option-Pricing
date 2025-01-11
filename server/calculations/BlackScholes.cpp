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

// Black-Scholes formula for a European put option
double black_scholes_put(double S, double K, double T, double r, double sigma) {
    double d1 = (std::log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * std::sqrt(T));
    double d2 = d1 - sigma * std::sqrt(T);

    double put_price = K * std::exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1);
    return put_price;
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

    double price;
    if (option_type == "call") {
        price = black_scholes_call(S, K, T, r, sigma);
    } else if (option_type == "put") {
        price = black_scholes_put(S, K, T, r, sigma);
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

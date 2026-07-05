FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# The committed binaries in calculations/ are built for macOS (arm64) and won't
# run in this Linux container, so recompile them from source at image build time.
RUN g++ -O2 -o calculations/black_scholes calculations/BlackScholes.cpp \
    && g++ -O2 -o calculations/monte_carlo calculations/MonteCarlo.cpp \
    && g++ -O2 -o calculations/binomial_tree calculations/BinomialTree.cpp

ENV PORT=8080
EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app

import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ResultDisplay from "../components/ResultDisplay";
import HeatmapComponent from "../components/HeatMap";
import { fetchAllResults } from "../services/api";

// Import the external CSS
import "./Home.css";


function Home() {
  const [callResult, setCallResult] = useState(null);
  const [putResult, setPutResult] = useState(null);
  const [callHeatmapData, setCallHeatmapData] = useState(null);
  const [putHeatmapData, setPutHeatmapData] = useState(null);
  const [volatilities, setVolatilities] = useState([]);
  const [spotPrices, setSpotPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async (formData) => {
    const {
      strikePrice,
      spotPrice,
      volatility,
      timeToMaturity,
      riskFreeRate,
      modelType,
      viewType,
    } = formData;

    const calculatedSpotPrices = [
      spotPrice * 0.7,
      spotPrice * 0.8,
      spotPrice * 0.9,
      parseFloat(spotPrice),
      spotPrice * 1.1,
      spotPrice * 1.2,
      spotPrice * 1.3,
    ];
    setSpotPrices(calculatedSpotPrices);

    const calculatedVolatilities = [
      volatility * 0.7,
      volatility * 0.8,
      volatility * 0.9,
      parseFloat(volatility),
      volatility * 1.1,
      volatility * 1.2,
      volatility * 1.3,
    ];
    setVolatilities(calculatedVolatilities);

    setIsLoading(true);
    try {
      // One request computes both heatmaps and both prices
      const results = await fetchAllResults({
        spotPrices: calculatedSpotPrices,
        volatilities: calculatedVolatilities,
        spotPrice: parseFloat(spotPrice),
        volatility: parseFloat(volatility),
        strikePrice,
        timeToMaturity,
        riskFreeRate,
        modelType,
        viewType,
      });

      setCallHeatmapData(results.call.heatmap);
      setPutHeatmapData(results.put.heatmap);
      setCallResult(results.call.price);
      setPutResult(results.put.price);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homeContainer">
      <h1 className="topTitle">OptiMap</h1>
      <h2 className="subTitle">Visualize the price and P&L of an option as its sensitivity to market fluctuations changes</h2>

      <div className="layoutWrapper">
        {/* Input */}
        <div className="inputSection">
          <InputForm onSubmit={handleCalculate} loading={isLoading} />
        </div>

        {/* Heatmaps */}
        <div className="heatmapsContainer">
          {/* Call Heatmap */}
          <div className="heatmapBox">
            <ResultDisplay result={callResult} optionType="call" />
            <HeatmapComponent
              heatmapData={callHeatmapData}
              volatilities={volatilities}
              spotPrices={spotPrices}
            />
          </div>
          {/* Put Heatmap */}
          <div className="heatmapBox">
            <ResultDisplay result={putResult} optionType="put" />
            <HeatmapComponent
              heatmapData={putHeatmapData}
              volatilities={volatilities}
              spotPrices={spotPrices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ResultDisplay from "../components/ResultDisplay";
import HeatmapComponent from "../components/HeatMap";
import { calculateOptionPrice, fetchHeatmapData } from "../services/api";

// Import the external CSS
import "./Home.css";


function Home() {
  const [callResult, setCallResult] = useState(null);
  const [putResult, setPutResult] = useState(null);
  const [callHeatmapData, setCallHeatmapData] = useState(null);
  const [putHeatmapData, setPutHeatmapData] = useState(null);
  const [volatilities, setVolatilities] = useState([]);
  const [spotPrices, setSpotPrices] = useState([]);

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

    try {
      const [callHeatmap, putHeatmap] = await Promise.all([
        fetchHeatmapData({
          spotPrices: calculatedSpotPrices,
          volatilities: calculatedVolatilities,
          strikePrice,
          timeToMaturity,
          optionType: "call",
          riskFreeRate,
          modelType,
          viewType,
        }),
        fetchHeatmapData({
          spotPrices: calculatedSpotPrices,
          volatilities: calculatedVolatilities,
          strikePrice,
          timeToMaturity,
          optionType: "put",
          riskFreeRate,
          modelType,
          viewType,
        }),
      ]);

      const [callResponse, putResponse] = await Promise.all([
        calculateOptionPrice({
          ...formData,
          optionType: "call",
        }),
        calculateOptionPrice({
          ...formData,
          optionType: "put",
        }),
      ]);

      setCallHeatmapData(callHeatmap);
      setPutHeatmapData(putHeatmap);
      setCallResult(callResponse.option_price);
      setPutResult(putResponse.option_price);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="homeContainer">
      <h1 className="topTitle">OptiMap</h1>
      <h2 className="subTitle">Visualize the price and P&L of an option as its sensitivity to market fluctuations changes</h2>

      <div className="layoutWrapper">
        {/* Input */}
        <div className="inputSection">
          <InputForm onSubmit={handleCalculate} />
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
              callPrice={callResult}
              putPrice={0}
            />
          </div>
          {/* Put Heatmap */}
          <div className="heatmapBox">
            <ResultDisplay result={putResult} optionType="put" />
            <HeatmapComponent
              heatmapData={putHeatmapData}
              volatilities={volatilities}
              spotPrices={spotPrices}
              callPrice={0}
              putPrice={putResult}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
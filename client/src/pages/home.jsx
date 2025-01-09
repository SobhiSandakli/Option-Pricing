import React, { useState } from "react";
import InputForm from "../components/InputForm";
import ResultDisplay from "../components/ResultDisplay";
import HeatmapComponent from "../components/HeatMap";
import { Box, Typography } from "@mui/material";
import { calculateOptionPrice, fetchHeatmapData } from "../services/api";

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
      // Fetch both heatmaps in parallel
      console.log(
        calculatedSpotPrices,
        calculatedVolatilities,
        strikePrice,
        timeToMaturity,
        riskFreeRate,
        modelType,
        viewType
      );
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
      console.log("callHeatmap", callHeatmap);
      console.log("formdata", formData);
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
    <Box
      sx={{
        backgroundColor: "#001f3f",
        minHeight: "100vh", // Ensure the background covers the full viewport height
        color: "white",
        display: "flex",
        flexDirection: "row", // Arrange children horizontally
      }}
    >
      {/* Left Side: Input Form */}
      <Box
        sx={{
          width: "20%", // Adjust the width as needed
          backgroundColor: "#002b5c",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <InputForm onSubmit={handleCalculate} />
      </Box>

      {/* Right Side: Title and Option Sections */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column", // Arrange title and option sections vertically
          alignItems: "center",
          padding: 2,
        }}
      >
        {/* Title */}
        <Typography variant="h3" align="center" sx={{ marginBottom: 2 }}>
          Option Pricing Tool
        </Typography>

        {/* Option Sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", // Arrange call and put sections horizontally
            gap: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Call Option Section */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#003f5c",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ResultDisplay result={callResult} optionType="call" />
            <Typography variant="h6" sx={{ marginTop: 2 }}></Typography>
            <HeatmapComponent
              heatmapData={callHeatmapData}
              volatilities={volatilities}
              spotPrices={spotPrices}
              callPrice={callResult}
              putPrice={0}
            />
          </Box>

          {/* Put Option Section */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#003f5c",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ResultDisplay result={putResult} optionType="put" />
            <Typography variant="h6" sx={{ marginTop: 2 }}></Typography>
            <HeatmapComponent
              heatmapData={putHeatmapData}
              volatilities={volatilities}
              spotPrices={spotPrices}
              callPrice={0}
              putPrice={putResult}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;

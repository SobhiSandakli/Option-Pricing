import React, { useState } from "react";
import InputForm from "./components/InputForm";
import ResultDisplay from "./components/ResultDisplay";
import HeatmapComponent from "./components/HeatMap";
import { Box, Typography } from "@mui/material";
import { calculateOptionPrice, fetchHeatmapData } from "./services/api";

function App() {
  const [callResult, setCallResult] = useState(null);
  const [putResult, setPutResult] = useState(null);
  const [callHeatmapData, setCallHeatmapData] = useState(null);
  const [putHeatmapData, setPutHeatmapData] = useState(null);

  const handleCalculate = async (formData) => {
    const { strikePrice, spotPrice, volatility, timeToMaturity } = formData;

    const spotPrices = [
      spotPrice,
      spotPrice * 1.1,
      spotPrice * 1.2,
      spotPrice * 1.3,
      spotPrice * 1.4,
      spotPrice * 1.5,
    ];
    const volatilities = [
      volatility,
      volatility * 1.1,
      volatility * 1.2,
      volatility * 1.3,
      volatility * 1.4,
      volatility * 1.5,
    ];

    try {
      // Calculate Call Option
      const callHeatmap = await fetchHeatmapData({
        spotPrices,
        volatilities,
        strikePrice,
        timeToMaturity,
        optionType: "call",
      });
      setCallHeatmapData(callHeatmap);

      const callResponse = await calculateOptionPrice({
        ...formData,
        optionType: "call",
      });
      setCallResult(callResponse.option_price);

      // Calculate Put Option
      const putHeatmap = await fetchHeatmapData({
        spotPrices,
        volatilities,
        strikePrice,
        timeToMaturity,
        optionType: "put",
      });
      setPutHeatmapData(putHeatmap);

      const putResponse = await calculateOptionPrice({
        ...formData,
        optionType: "put",
      });
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
            <ResultDisplay result={callResult} />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Heatmap
            </Typography>
            <HeatmapComponent heatmapData={callHeatmapData} />
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
            <ResultDisplay result={putResult} />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Heatmap
            </Typography>
            <HeatmapComponent heatmapData={putHeatmapData} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;

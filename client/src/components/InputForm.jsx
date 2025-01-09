import React, { useState } from "react";
import { Box, Button, TextField, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";

function InputForm({ onSubmit }) {
  const [strikePrice, setStrikePrice] = useState("");
  const [spotPrice, setSpotPrice] = useState("");
  const [volatility, setVolatility] = useState("");
  const [timeToMaturity, setTimeToMaturity] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState("");
  const [selectedModel, setSelectedModel] = useState("Black-Scholes");
  const [selectedOption, setSelectedOption] = useState("Price");

  const [isValid, setIsValid] = useState({
    strikePrice: true,
    spotPrice: true,
    volatility: true,
    timeToMaturity: true,
    riskFreeRate: true,
  });

  const handleBlur = (field, value) => {
    setIsValid((prev) => ({
      ...prev,
      [field]: value !== "" && !isNaN(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedVolatility = parseFloat(volatility) / 100; // Divide volatility by 100
    const formattedRiskFreeRate = parseFloat(riskFreeRate) / 100; // Divide risk-free rate by 100
    onSubmit({
      strikePrice,
      spotPrice,
      volatility: formattedVolatility,
      timeToMaturity,
      riskFreeRate: formattedRiskFreeRate,
      modelType: selectedModel,
      viewType: selectedOption,
    });
  };

  const handleModelChange = (event, newModel) => {
    if (newModel !== null) {
      setSelectedModel(newModel);
    }
  };

  const handleOptionChange = (event, newOption) => {
    if (newOption !== null) {
      setSelectedOption(newOption);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Input Parameters
      </Typography>
      <TextField
        label="Spot Price"
        variant="outlined"
        type="number"
        value={spotPrice}
        onChange={(e) => setSpotPrice(e.target.value)}
        onBlur={(e) => handleBlur("spotPrice", e.target.value)}
        fullWidth
        required
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.spotPrice ? "white" : "red" },
            "&:hover fieldset": { borderColor: isValid.spotPrice ? "#4caf50" : "red" },
            "&.Mui-focused fieldset": { borderColor: isValid.spotPrice ? "#4caf50" : "red" },
          },
        }}
      />
      <TextField
        label="Strike Price"
        variant="outlined"
        type="number"
        value={strikePrice}
        onChange={(e) => setStrikePrice(e.target.value)}
        onBlur={(e) => handleBlur("strikePrice", e.target.value)}
        fullWidth
        required
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.strikePrice ? "white" : "red" },
            "&:hover fieldset": { borderColor: isValid.strikePrice ? "#4caf50" : "red" },
            "&.Mui-focused fieldset": { borderColor: isValid.strikePrice ? "#4caf50" : "red" },
          },
        }}
      />
      <TextField
        label="Volatility (%)"
        variant="outlined"
        type="number"
        value={volatility}
        onChange={(e) => setVolatility(e.target.value)}
        onBlur={(e) => handleBlur("volatility", e.target.value)}
        fullWidth
        required
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.volatility ? "white" : "red" },
            "&:hover fieldset": { borderColor: isValid.volatility ? "#4caf50" : "red" },
            "&.Mui-focused fieldset": { borderColor: isValid.volatility ? "#4caf50" : "red" },
          },
        }}
      />
      <TextField
        label="Time to Maturity (Years)"
        variant="outlined"
        type="number"
        value={timeToMaturity}
        onChange={(e) => setTimeToMaturity(e.target.value)}
        onBlur={(e) => handleBlur("timeToMaturity", e.target.value)}
        fullWidth
        required
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.timeToMaturity ? "white" : "red" },
            "&:hover fieldset": { borderColor: isValid.timeToMaturity ? "#4caf50" : "red" },
            "&.Mui-focused fieldset": { borderColor: isValid.timeToMaturity ? "#4caf50" : "red" },
          },
        }}
      />
      <TextField
        label="Risk-Free Interest Rate (%)"
        variant="outlined"
        type="number"
        value={riskFreeRate}
        onChange={(e) => setRiskFreeRate(e.target.value)}
        onBlur={(e) => handleBlur("riskFreeRate", e.target.value)}
        fullWidth
        required
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.riskFreeRate ? "white" : "red" },
            "&:hover fieldset": { borderColor: isValid.riskFreeRate ? "#4caf50" : "red" },
            "&.Mui-focused fieldset": { borderColor: isValid.riskFreeRate ? "#4caf50" : "red" },
          },
        }}
      />
      <ToggleButtonGroup
        color="primary"
        value={selectedModel}
        exclusive
        onChange={handleModelChange}
        aria-label="Model Type"
        sx={{
          display: "flex",
          justifyContent: "center",
          "& .MuiToggleButton-root": {
            backgroundColor: "#002b5c", // Navy for unselected
            color: "#fff",
            borderColor: "#fff", // White outline
            "&.Mui-selected": {
              backgroundColor: "#4caf50", // Green like the Calculate button
              color: "#fff",
            },
            "&:hover": {
              backgroundColor: "#227925", // Green for hover
              color: "#fff",
            },
            flex: 1, // Ensure equal width
          },
        }}
      >
        <ToggleButton value="Black-Scholes">Black-Scholes</ToggleButton>
        <ToggleButton value="Binomial">Binomial</ToggleButton>
        <ToggleButton value="Monte Carlo">Monte Carlo</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="primary"
        value={selectedOption}
        exclusive
        onChange={handleOptionChange}
        aria-label="Option Type"
        sx={{
          display: "flex",
          justifyContent: "center",
          "& .MuiToggleButton-root": {
            backgroundColor: "#002b5c", // Navy for unselected
            color: "#fff",
            borderColor: "#fff", // White outline
            "&.Mui-selected": {
              backgroundColor: "#4caf50", // Green like the Calculate button
              color: "#fff",
            },
            "&:hover": {
              backgroundColor: "#227925", // Green for hover
              color: "#fff",
            },
            flex: 1, // Ensure equal width
          },
        }}
      >
        <ToggleButton value="Price">Price</ToggleButton>
        <ToggleButton value="P&L">P&L</ToggleButton>
      </ToggleButtonGroup>
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#4caf50",
          "&:hover": { backgroundColor: "#388e3c" },
        }}
      >
        Calculate
      </Button>
    </Box>
  );
}

export default InputForm;
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

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

  const [autoSubmit, setAutoSubmit] = useState(false);

  const handleBlur = (field, value) => {
    setIsValid((prev) => ({
      ...prev,
      [field]: value !== "" && !isNaN(value) && value >= 0,
    }));
  };

  const handleSubmit = () => {
    const formattedVolatility = parseFloat(volatility) / 100; // Divide volatility by 100
    const formattedRiskFreeRate = parseFloat(riskFreeRate) / 100; // Divide risk-free rate by 100
    const formattedTimeToMaturity = parseFloat(timeToMaturity) / 12; // Convert months to years
    onSubmit({
      strikePrice,
      spotPrice,
      volatility: formattedVolatility,
      timeToMaturity: formattedTimeToMaturity,
      riskFreeRate: formattedRiskFreeRate,
      modelType: selectedModel,
      viewType: selectedOption,
    });
    setAutoSubmit(true);
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

  useEffect(() => {
    if (autoSubmit) {
      handleSubmit();
    }
  }, [
    strikePrice,
    spotPrice,
    volatility,
    timeToMaturity,
    riskFreeRate,
    selectedModel,
    selectedOption,
  ]);

  const handleInputChange = (setter, max) => (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,3}$/;
    if (regex.test(value) && value <= max) {
      setter(value);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
    component="form"
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
    onKeyPress={handleKeyPress}
  >
      <Typography variant="h5" gutterBottom>
        Input Parameters
      </Typography>
      <TextField
        label="Spot Price"
        variant="outlined"
        type="number"
        value={spotPrice}
        onChange={handleInputChange(setSpotPrice, 50000)}
        onBlur={(e) => handleBlur("spotPrice", e.target.value)}
        fullWidth
        required
        inputProps={{
          step: "0.001",
          min: 0,
          max: 50000,
          inputMode: "decimal", // Helps mobile browsers display numeric keyboards
          pattern: "[0-9]*", // Prevents non-numeric input
        }}
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="The current market price of the underlying asset.">
                <InfoIcon style={{ color: "#fff", cursor: "pointer" }} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.spotPrice ? "white" : "red" },
            "&:hover fieldset": {
              borderColor: isValid.spotPrice ? "#4caf50" : "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: isValid.spotPrice ? "#4caf50" : "red",
            },
          },
        }}
      />

      <TextField
        label="Strike Price"
        variant="outlined"
        type="number"
        value={strikePrice}
        onChange={handleInputChange(setStrikePrice, 50000)}
        onBlur={(e) => handleBlur("strikePrice", e.target.value)}
        fullWidth
        required
        inputProps={{ step: "0.001", min: 0, max: 50000 ,inputMode: "decimal", pattern: "[0-9]*",}}
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="The price at which the option can be exercised.">
                <InfoIcon style={{ color: "#fff", cursor: "pointer" }} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isValid.strikePrice ? "white" : "red",
            },
            "&:hover fieldset": {
              borderColor: isValid.strikePrice ? "#4caf50" : "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: isValid.strikePrice ? "#4caf50" : "red",
            },
          },
        }}
      />
      <TextField
        label="Volatility (%)"
        variant="outlined"
        type="number"
        value={volatility}
        onChange={handleInputChange(setVolatility, 5000)}
        onBlur={(e) => handleBlur("volatility", e.target.value)}
        fullWidth
        required
        inputProps={{ step: "0.001", min: 0, max: 5000 ,inputMode: "decimal", pattern: "[0-9]*",}}
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Annualized standard deviation of returns.">
                <InfoIcon style={{ color: "#fff", cursor: "pointer" }} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": { borderColor: isValid.volatility ? "white" : "red" },
            "&:hover fieldset": {
              borderColor: isValid.volatility ? "#4caf50" : "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: isValid.volatility ? "#4caf50" : "red",
            },
          },
        }}
      />
      <TextField
        label="Time to Maturity (Months)"
        variant="outlined"
        type="number"
        value={timeToMaturity}
        onChange={handleInputChange(setTimeToMaturity, 99)}
        onBlur={(e) => handleBlur("timeToMaturity", e.target.value)}
        fullWidth
        required
        inputProps={{ step: "0.001", min: 0, max: 99 ,inputMode: "decimal", pattern: "[0-9]*",}}
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Number of months until the option expires.">
                <InfoIcon style={{ color: "#fff", cursor: "pointer" }} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isValid.timeToMaturity ? "white" : "red",
            },
            "&:hover fieldset": {
              borderColor: isValid.timeToMaturity ? "#4caf50" : "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: isValid.timeToMaturity ? "#4caf50" : "red",
            },
          },
        }}
      />
      <TextField
        label="Risk-Free Interest Rate (%)"
        variant="outlined"
        type="number"
        value={riskFreeRate}
        onChange={handleInputChange(setRiskFreeRate, 99)}
        onBlur={(e) => handleBlur("riskFreeRate", e.target.value)}
        fullWidth
        required
        inputProps={{ step: "0.001", min: 0, max: 99 ,inputMode: "decimal", pattern: "[0-9]*",}}
        InputLabelProps={{ style: { color: "#fff" } }}
        InputProps={{
          style: { color: "white" },
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Annualized rate on a risk-free asset.">
                <InfoIcon style={{ color: "#fff", cursor: "pointer" }} />
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          ".MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: isValid.riskFreeRate ? "white" : "red",
            },
            "&:hover fieldset": {
              borderColor: isValid.riskFreeRate ? "#4caf50" : "red",
            },
            "&.Mui-focused fieldset": {
              borderColor: isValid.riskFreeRate ? "#4caf50" : "red",
            },
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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          "& .MuiToggleButton-root": {
            backgroundColor: "#003f5c", // Unselected color
            color: "#fff",
            borderColor: "#fff", // White outline
            "&.Mui-selected": {
              backgroundColor: "#4caf50", // Selected color
              color: "#fff",
            },
            "&:hover": {
              backgroundColor: "#227925", // Hover color
              color: "#fff",
            },
            // Larger screens (≥659px)
            "@media (min-width: 659px)": {
              fontSize: "0.65rem",
              width: "100%",
              minWidth: "auto",
              padding: "2px 6px",
            },
            // Smaller screens (<659px)
            "@media (max-width: 658px)": {
              flex: 1, // Let buttons fill available width
            },
          },
        }}
      >
        <ToggleButton value="Black-Scholes">Black-Scholes</ToggleButton>
        <ToggleButton value="Monte Carlo">Monte Carlo</ToggleButton>
        <ToggleButton value="Binomial">Binomial</ToggleButton>
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
            backgroundColor: "##003f5c", // Navy for unselected
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
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          backgroundColor: "#4caf50", // Green color
          "&:hover": {
            backgroundColor: "#388e3c", // Darker green on hover
          },
        }}
      >
        Calculate
      </Button>
    </Box>
  );
}

export default InputForm;

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

function InputForm({ onSubmit }) {
  const [strikePrice, setStrikePrice] = useState('');
  const [spotPrice, setSpotPrice] = useState('');
  const [volatility, setVolatility] = useState('');
  const [timeToMaturity, setTimeToMaturity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ strikePrice, spotPrice, volatility, timeToMaturity });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
        fullWidth
        InputLabelProps={{ style: { color: '#fff' } }}
        InputProps={{
          style: { color: 'white' },
        }}
        sx={{
          '.MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: '#4caf50' },
          },
        }}
      />
      <TextField
        label="Strike Price"
        variant="outlined"
        type="number"
        value={strikePrice}
        onChange={(e) => setStrikePrice(e.target.value)}
        fullWidth
        InputLabelProps={{ style: { color: '#fff' } }}
        InputProps={{
          style: { color: 'white' },
        }}
        sx={{
          '.MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: '#4caf50' },
          },
        }}
      />
      <TextField
        label="Volatility (%)"
        variant="outlined"
        type="number"
        value={volatility}
        onChange={(e) => setVolatility(e.target.value)}
        fullWidth
        InputLabelProps={{ style: { color: '#fff' } }}
        InputProps={{
          style: { color: 'white' },
        }}
        sx={{
          '.MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: '#4caf50' },
          },
        }}
      />
      <TextField
        label="Time to Maturity (Years)"
        variant="outlined"
        type="number"
        value={timeToMaturity}
        onChange={(e) => setTimeToMaturity(e.target.value)}
        fullWidth
        InputLabelProps={{ style: { color: '#fff' } }}
        InputProps={{
          style: { color: 'white' },
        }}
        sx={{
          '.MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: '#4caf50' },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#4caf50',
          '&:hover': { backgroundColor: '#388e3c' },
        }}
      >
        Calculate
      </Button>
    </Box>
  );
}

export default InputForm;

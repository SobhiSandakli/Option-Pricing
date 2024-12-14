import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <label>
        Strike Price:
        <input
          type="number"
          value={strikePrice}
          onChange={(e) => setStrikePrice(e.target.value)}
        />
      </label>
      <label>
        Spot Price:
        <input
          type="number"
          value={spotPrice}
          onChange={(e) => setSpotPrice(e.target.value)}
        />
      </label>
      <label>
        Volatility:
        <input
          type="number"
          value={volatility}
          onChange={(e) => setVolatility(e.target.value)}
        />
      </label>
      <label>
        Time to Maturity (Years):
        <input
          type="number"
          value={timeToMaturity}
          onChange={(e) => setTimeToMaturity(e.target.value)}
        />
      </label>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default InputForm;

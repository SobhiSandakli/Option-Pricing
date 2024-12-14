import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { calculateOptionPrice } from './services/api';

function App() {
  const [result, setResult] = useState(null);

  const handleCalculate = async (formData) => {
    try {
      const response = await calculateOptionPrice(formData);
      setResult(response.option_price); // Assuming the backend sends { price: value }
    } catch (error) {
      console.error(error);
      setResult('Error calculating price');
    }
  };

  return (
    <div>
      <h1>Option Pricing Tool</h1>
      <InputForm onSubmit={handleCalculate} />
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;

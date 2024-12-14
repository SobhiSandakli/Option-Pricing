import React from 'react';

function ResultDisplay({ result }) {
  return (
    <div>
      <h2>Option Pricing Result</h2>
      {result ? <p>The calculated price is: {result}</p> : <p>No result yet.</p>}
    </div>
  );
}

export default ResultDisplay;

import React from "react";
import Plot from "react-plotly.js";

const HeatmapComponent = ({ heatmapData, volatilities, spotPrices }) => {
  if (!heatmapData || !volatilities || !spotPrices) {
    return null;
  }

  // Create ticktext for volatilities by multiplying by 100
  const tickTextVolatilities = volatilities.map(v => (v * 100).toFixed(2));

  return (
    <Plot
      data={[
        {
          z: heatmapData,
          x: volatilities,
          y: spotPrices,
          type: "heatmap",
          colorscale: "Viridis",
          showscale: true,
          text: heatmapData,
          texttemplate: "%{text}",
          textfont: {
            size: 12,
            color: "white",
          },
        },
      ]}
      layout={{
        title: "",
        width: 540,
        height: 450,
        margin: { t: 10, b: 40, l: 50, r: 10 },
        xaxis: {
          title: "Volatility (%)",
          tickmode: "array",
          tickvals: volatilities,
          ticktext: tickTextVolatilities, // Display volatilities as percentages
          autorange: true,
        },
        yaxis: {
          title: "Spot Price",
          tickmode: "array",
          tickvals: spotPrices,
          autorange: true,
        },
      }}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
    />
  );
};

export default HeatmapComponent;
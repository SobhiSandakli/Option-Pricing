import React from "react";
import Plot from "react-plotly.js";

const HeatmapComponent = ({ heatmapData }) => {
  if (!heatmapData) {
    return null; // Do not render if no data
  }

  return (
    <Plot
      data={[
        {
          z: heatmapData,
          x: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6], // Volatility range
          y: [50, 60, 70, 80, 90, 100],      // Spot price range
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
          tickvals: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
          scaleanchor: "y",
          scaleratio: 100, // Set scaleratio to 1 for square cells
        },
        yaxis: {
          title: "Spot Price",
          tickmode: "array",
          tickvals: [50, 60, 70, 80, 90, 100],
          // Remove scaleanchor and scaleratio from yaxis
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
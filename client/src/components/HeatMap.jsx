import React from "react";
import Plot from "react-plotly.js";

const HeatmapComponent = ({
  heatmapData,
  volatilities,
  spotPrices,
  callPrice,
  putPrice,
}) => {
  if (!heatmapData || !volatilities || !spotPrices) {
    return null;
  }

  const tickTextVolatilities = volatilities.map((v) => (v * 100).toFixed(2));
  const referencePrice = heatmapData[Math.floor(spotPrices.length / 2)][Math.floor(volatilities.length / 2)];
  return (
    <Plot
      data={[
        {
          z: heatmapData,
          x: volatilities,
          y: spotPrices,
          type: "heatmap",

          colorscale: [
            [0, "rgb(255, 0, 0)"], // red at the low end
            [0.5, "rgb(255, 255, 255)"], // white at mid
            [1, "rgb(0, 128, 0)"], // green at the high end
          ],

          zmid: referencePrice,

          showscale: true,
          text: heatmapData,
          texttemplate: "%{text}",
          textfont: {
            size: 12,
            color: "black",
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
          ticktext: tickTextVolatilities,
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

import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const HeatmapComponent = ({ heatmapData, volatilities, spotPrices }) => {
  // Manage dynamic font size for both axis labels and in-plot text
  const [textFontSize, setTextFontSize] = useState(12);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setTextFontSize(8);
      } else if (width < 1190) {
        setTextFontSize(10);
      } else {
        setTextFontSize(12);
      }
    }

    // Call once on mount to set initial size
    handleResize();

    // Listen to window resizing
    window.addEventListener("resize", handleResize);

    // Also handle orientation changes on mobile
    window.addEventListener("orientationchange", handleResize);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Return null if data is missing
  if (!heatmapData || !volatilities || !spotPrices) {
    return null;
  }

  // Prepare data for axis ticks
  const tickTextVolatilities = volatilities.map((v) => (v * 100).toFixed(2));
  // Example reference for zmid
  const referencePrice = heatmapData[Math.floor(spotPrices.length / 2)][
    Math.floor(volatilities.length / 2)
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        /* This paddingBottom sets ~6:5 aspect ratio */
        paddingBottom: "83.3333%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Plot
          data={[
            {
              z: heatmapData,
              x: volatilities,
              y: spotPrices,
              type: "heatmap",
              colorscale: [
                [0, "rgb(255, 0, 0)"],
                [0.5, "rgb(255, 255, 255)"],
                [1, "rgb(0, 128, 0)"],
              ],
              zmid: referencePrice,
              text: heatmapData,
              texttemplate: "%{text}",
              textfont: {
                size: textFontSize,
                color: "black",
              },
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 10, b: 40, l: 50, r: 10 },
            xaxis: {
              // Make axis label use the same textFontSize
              title: {
                text: "Volatility (%)",
                font: { size: textFontSize },
              },
              tickmode: "array",
              tickvals: volatilities,
              ticktext: tickTextVolatilities,
              tickfont: { size: textFontSize },
            },
            yaxis: {
              // Make axis label use the same textFontSize
              title: {
                text: "Spot Price",
                font: { size: textFontSize },
              },
              tickmode: "array",
              tickvals: spotPrices,
              tickfont: { size: textFontSize },
            },
            aspectmode: "manual",
            aspectratio: { x: 6, y: 5 },
            paper_bgcolor: "white",
            plot_bgcolor: "white",
          }}
          config={{
            staticPlot: true ,
            displayModeBar: false,
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </div>
    </div>
  );
};

export default HeatmapComponent;

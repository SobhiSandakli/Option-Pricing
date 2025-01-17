export const calculateOptionPrice = async (data) => {
  console.log("sending data to the frontend api", data);
  console.log('API URL:', apiUrl);
  const apiUrl = process.env.REACT_APP_API_URL; // Get the URL from environment variable
  const response = await fetch(`${apiUrl}/option-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // Parse the JSON response
  const responseData = await response.json();

  // Log the parsed response
  console.log(responseData);
  if (!response.ok) {
    throw new Error("Failed to calculate option price");
  }
  return responseData;
};

export const fetchHeatmapData = async ({
  spotPrices,
  volatilities,
  strikePrice,
  timeToMaturity,
  optionType,
  riskFreeRate,
  modelType,
  viewType,
}) => {
  console.log("fetching heatmap data for ", optionType);
  const apiUrl = process.env.REACT_APP_API_URL; // Get the URL from environment variable
  const response = await fetch(`${apiUrl}/heatmap-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spotPrices,
      volatilities,
      strikePrice,
      timeToMaturity,
      optionType,
      riskFreeRate,
      modelType,
      viewType,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch heatmap data");
  }
  
  console.log("data back for ", optionType, data.heatmap);
  return data.heatmap; // Return the 2D heatmap array
};

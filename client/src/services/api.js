// Fetch call+put prices and heatmaps in a single request
export const fetchAllResults = async (data) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const response = await fetch(`${apiUrl}/calculate-all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || "Failed to calculate option data");
  }
  return responseData; // { call: { price, heatmap }, put: { price, heatmap } }
};

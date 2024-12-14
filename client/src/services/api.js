export const calculateOptionPrice = async (data) => {
  const response = await fetch("http://127.0.0.1:5000/option-price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // Parse the JSON response
  const responseData = await response.json();

  // Log the parsed response
  console.log("Parsed Response Data:", responseData);

  if (!response.ok) {
    throw new Error("Failed to calculate option price");
  }
  return responseData;
};

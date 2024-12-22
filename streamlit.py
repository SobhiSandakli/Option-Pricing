import streamlit as st
import requests
import plotly.graph_objects as go
import numpy as np

# Fetch heatmap data from Flask server
def fetch_heatmap_data(spot_prices, volatilities, strike_price, time_to_maturity):
    url = "http://127.0.0.1:5000/heatmap-data"
    payload = {
        "spotPrices": spot_prices,
        "volatilities": volatilities,
        "strikePrice": strike_price,
        "timeToMaturity": time_to_maturity
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()['heatmap']
    else:
        st.error(f"Error fetching data: {response.json().get('error')}")
        return None

# Example default values for testing
spot_prices = [50, 60, 70, 80, 90, 100]
volatilities = [0.1, 0.2, 0.3, 0.4, 0.5]
strike_price = 100
time_to_maturity = 1

# Fetch and display heatmap if button is pressed
if st.button("Generate Heatmap"):
    heatmap_data = fetch_heatmap_data(spot_prices, volatilities, strike_price, time_to_maturity)
    if heatmap_data:
        # Convert heatmap data to a numpy array
        heatmap_data = np.array(heatmap_data)
        
        # Create the heatmap figure
        fig = go.Figure(data=go.Heatmap(
            z=heatmap_data,
            x=volatilities,
            y=spot_prices,
            colorscale='Viridis',
            colorbar=dict(title='Option Price'),
            text=heatmap_data,  # Display values on cells
            hoverinfo='text',  # Show values on hover
            showscale=True
        ))

        # Update the layout for full-screen and remove axes labels
        fig.update_layout(
            title='Call Option Price Heatmap',
            xaxis_title='Volatility (%)',
            yaxis_title='Spot Price',
            title_x=0.5,  # Center the title
            title_y=0.95, # Adjust title position
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            height=800,  # Make it taller
            width=1500,  # Make it wider
        )
        
        # Render the heatmap with full width
        st.plotly_chart(fig, use_container_width=True)

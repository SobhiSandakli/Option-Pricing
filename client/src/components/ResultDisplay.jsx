import React from 'react';
import { Box, Typography } from '@mui/material';

function ResultDisplay({ result, optionType }) {
  const backgroundColor = optionType === 'put' ? '#f44336' : '#4caf50'; // Red for put, green for call
  const optionLabel = optionType === 'put' ? 'Put price' : 'Call price';

  return (
    <Box
      sx={{
        backgroundColor,
        padding: 2, // Reduced padding for smaller height
        borderRadius: 3, // Slightly larger border radius for a smoother look
        boxShadow: 6, // Stronger shadow for more depth
        height: 'auto', // Let the box size adjust based on content
        minWidth: 400, // Limit the width for a more contained look
        maxHeight: 120, // Limit the height to prevent it from growing too much
        margin: '0 auto', // Center it horizontally
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {result ? (
        <React.Fragment>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {optionLabel}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {result} $
          </Typography>
        </React.Fragment>
      ) : (
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          No result yet. Please calculate.
        </Typography>
      )}
    </Box>
  );
}

export default ResultDisplay;
import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PlayHover = () => {
  return (
    <IconButton 
      sx={{
        backgroundColor: 'white', // White background
        width: 32,
        height: 32,
        '.MuiSvgIcon-root': { // Style for the icon
          color: '#181C1E', // Initial color of the icon
        },
        '&:hover': {
          backgroundColor: 'white', // Background remains the same on hover
          '.MuiSvgIcon-root': {
            color: '#FF6E1D', // Color of the icon on hover
          }
        }
      }}
    >
      <PlayArrowIcon />
    </IconButton>
  );
};

export default PlayHover;
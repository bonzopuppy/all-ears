import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function PromptExample ({color, icon, copy}) {
  return (
    <Box sx={{
      width: '269px',
      height: '172px',
      padding: '16px',
      backgroundColor: color,
      borderRadius: '16px',
      ':hover': {
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.4)',
        cursor: 'pointer',
      }
    }}>
    <img src={icon} alt="Icon" height="24px" width="24px"/>
    <br />
    <br />
    <Typography variant="body1" sx={{ fontWeight: 500}}>
    {copy }
    </Typography>
    </Box>
  )
}

export default PromptExample;
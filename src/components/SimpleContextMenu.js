import React from 'react';
import { Menu } from '@mui/material';

export default function SimpleContextMenu({ anchorEl, open, onClose, children }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#F4F2F7',
          minWidth: 220
        },
        '& .MuiMenuItem-root': {
          '&:hover': {
            backgroundColor: 'rgba(255, 110, 29, 0.08)'
          }
        }
      }}
    >
      {children}
    </Menu>
  );
}

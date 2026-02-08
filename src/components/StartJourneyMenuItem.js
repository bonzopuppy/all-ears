import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

export default function StartJourneyMenuItem({ onClick }) {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>
        <ExploreIcon sx={{ color: 'primary.main' }} />
      </ListItemIcon>
      <ListItemText primary="Start Journey From Here" />
    </MenuItem>
  );
}

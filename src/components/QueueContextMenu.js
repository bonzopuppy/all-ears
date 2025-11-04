import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import AlbumIcon from '@mui/icons-material/Album';

function QueueContextMenu({ anchorEl, open, onClose, onRemove, onPlayNext, onGoToAlbum }) {
  const handleRemove = () => {
    onRemove();
    onClose();
  };

  const handlePlayNext = () => {
    onPlayNext();
    onClose();
  };

  const handleGoToAlbum = () => {
    onGoToAlbum();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#F4F2F7',
          minWidth: 200,
        },
        '& .MuiMenuItem-root': {
          '&:hover': {
            backgroundColor: 'rgba(255, 110, 29, 0.08)',
          },
        },
      }}
    >
      <MenuItem onClick={handleRemove}>
        <ListItemIcon>
          <DeleteIcon sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Remove from Queue" />
      </MenuItem>
      <MenuItem onClick={handlePlayNext}>
        <ListItemIcon>
          <SkipNextIcon sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Play Next" />
      </MenuItem>
      <MenuItem onClick={handleGoToAlbum}>
        <ListItemIcon>
          <AlbumIcon sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Go to Album" />
      </MenuItem>
    </Menu>
  );
}

export default QueueContextMenu;

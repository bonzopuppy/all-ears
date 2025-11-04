import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import AlbumIcon from '@mui/icons-material/Album';

function TrackContextMenu({ anchorEl, open, onClose, onAddToQueue, onPlayNext, onGoToAlbum }) {
  const handleAddToQueue = () => {
    onAddToQueue();
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
      <MenuItem onClick={handleAddToQueue}>
        <ListItemIcon>
          <QueueMusicIcon sx={{ color: 'primary.main' }} />
        </ListItemIcon>
        <ListItemText primary="Add to Queue" />
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

export default TrackContextMenu;

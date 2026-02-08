import React from "react";
import Box from "@mui/material/Box";
import { Typography, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ArtistItem = ({ imageUrl, textLine1, followers, artist, onClick, onMenuClick }) => {

    return (
      <Box
        onClick={onClick}
        sx={{
          width: 166,
          height: 248,
          backgroundColor: 'white',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(24, 28, 30, 0.08)',
            cursor: 'pointer',
            '.menuButton': {
              visibility: 'visible',
              opacity: 1
            }
          }
        }}
      >
        <img src={imageUrl} alt="Artist Image" style={{ width: 118, height: 118, borderRadius: '50%' }} />

        {onMenuClick && (
          <IconButton
            className="menuButton"
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(e);
            }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              visibility: 'hidden',
              opacity: 0,
              color: 'primary.main'
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        {/* <Box className="playButton" 
        sx={{ 
          position: 'absolute', 
          bottom: 70, 
          right: 18, 
          visibility: 'hidden', 
          opacity: 0,
          transition: 'opacity 0.4s ease'}}>
             <PlayHover />
        </Box> */}
        <Typography 
            variant="body1"
            sx={{
                fontWeight: 600, 
                marginLeft: '8px',
                marginTop: '10px',
                fontSize: '.9em' 
            }}
        >
            {artist && `${artist.name}`}
            
        </Typography>
        <Typography 
            variant="body1"
            sx={{
                fontWeight: 400, 
                marginLeft: '8px',
                fontSize: '.8em'
            }}
            >
             {artist && artist.followers?.total && `${artist.followers.total} Followers`}
        </Typography>
      </Box>
    );
  };

export default ArtistItem;
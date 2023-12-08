import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PlayHover from "./PlayHover";

const AlbumPlaylistItem = ({ imageUrl, textLine1, textLine2 }) => {
    return (
      <Box
        sx={{
          width: 166,
          minHeight: 248,
          backgroundColor: 'white',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          borderRadius: '8px',
        '&:hover': {
          backgroundColor: 'rgba(24, 28, 30, 0.08)', // Background color on hover
          cursor: 'pointer',

          // Show the play button on hover
          // '.playButton': {
          //   visibility: 'visible',
          //   opacity: 1,
          //   transition: 'opacity 0.3s ease'
          //     }
          }
        }}
      >
        <img src={imageUrl} alt="Album Cover" style={{ width: 150, height: 150, borderRadius: '4px' }} />
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
            {textLine1}
            
        </Typography>
        <Typography 
            variant="body1"
            sx={{
                fontWeight: 400, 
                marginLeft: '8px',
                fontSize: '.8em'
            }}
            >
            {textLine2}
        </Typography>
      </Box>
    );
  };

export default AlbumPlaylistItem;
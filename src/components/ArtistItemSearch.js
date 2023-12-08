import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PlayHover from "./PlayHover";

const ArtistItemSearch = ({ imageUrl, artist, followers }) => {
  
    return (
      <Box
        sx={{
          width: 166,
          minHeight: 248,
          backgroundColor: 'white',
          padding: '20px 8px 10px 8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
        <img src={imageUrl} alt="Artist Image" style={{ width: 118, height: 118, borderRadius: '50%' }} />
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
                fontSize: '.9em', 
                textAlign: 'center',
                wordWrap: 'break-word',
            }}
        >
            {artist}
            
        </Typography>
        <Typography 
            variant="body1"
            sx={{
                fontWeight: 400, 
                marginLeft: '8px',
                fontSize: '.8em'
            }}
            >
             {followers}
        </Typography>
      </Box>
    );
  };

export default ArtistItemSearch;
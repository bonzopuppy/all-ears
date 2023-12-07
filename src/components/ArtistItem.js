import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import PlayHover from "./PlayHover";

const ArtistItem = ({ imageUrl, textLine1, albumCount, songCount }) => {
    return (
      <Box
        sx={{
          width: 166,
          height: 218,
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
        <img src={imageUrl} alt="Album Cover" style={{ width: 118, height: 118, borderRadius: '50%' }} />
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
             {`${albumCount} Albums, ${songCount} Songs`}
        </Typography>
      </Box>
    );
  };

export default ArtistItem;
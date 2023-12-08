import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import musicPlayerAlbum from '../images/musicPlayerAlbum.png';
import PlayHover from './PlayHover';

function SongMedium({title, artist, duration, image}) {

    const formatDuration = (ms) => {
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        // Adding leading zero if seconds less than 10
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}:${seconds}`;
    };

    return (
        <li style={{ listStyleType: 'none' }}>

            <Box sx={{
                width: 413,
                height: 76,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '&:hover': {
                    backgroundColor: 'rgba(24, 28, 30, 0.08)', // Background color on hover
                    cursor: 'pointer',
                    borderRadius: '8px',
                    // Show the play button on hover    
                    '.playHover': {
                        visibility: 'visible',
                        opacity: 1,
                        transition: 'opacity 0.3s ease'
                    }
                }
            }}>

                {/* Album Image */}
                <Box sx={{ width: '64px', height: '64px', marginRight: '10px', marginLeft: '10px', position: 'relative' }}>
                    <img src={image} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                    <Box className="playHover"
                        sx={{
                            position: 'absolute',
                            top: 15,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'center',
                            visibility: 'hidden',
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                            zIndex: 1
                        }}>
                        <PlayHover />
                    </Box>
                </Box>
        

                {/* Song Info */}
                <Box>
                    <Typography variant="subtitle1" sx={{ 
                        fontWeight: '500',
                        lineHeight: '1.2',
                    }}>
                       {title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.6 }}>
                        {artist}
                    </Typography>
                </Box>

                {/* Song Duration */}
                <Box sx={{ marginLeft: 'auto', marginRight: '10px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: '400' }}>
                       {formatDuration(duration)} 
                    </Typography>
                </Box>
            </Box>
        </li>
    );
}

export default SongMedium;
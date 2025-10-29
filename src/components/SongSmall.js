import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PlayHover from './PlayHover';
import { useMusicContext } from './MusicContext';

function SongSmall({hotTrack}) {
    const { playTrack } = useMusicContext();

    const handleClick = () => {
        if (hotTrack) {
            playTrack(hotTrack);
        }
    };
    
    if (!hotTrack) {
        return null; // or return a loading spinner
    } else return (
        
        <li style={{ listStyleType: 'none' }}>

            <Box
                onClick={handleClick}
                sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                height: 76,
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
                    <img src={hotTrack.album.images[0].url} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4}} />
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
                    <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                        {hotTrack.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {hotTrack.artists[0].name}
                    </Typography>
                </Box>

            </Box>
        </li>
    );
}

export default SongSmall;
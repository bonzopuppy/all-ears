import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PlayHover from './PlayHover';
import { useMusicContext } from './MusicContext';

function SongMedium({song}) {
    const { playTrack } = useMusicContext();

    const handleClick = () => {
        if (song) {
            playTrack(song);
        }
    };

    function millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const songDuration = song?.duration_ms;
    const formattedDuration = millisToMinutesAndSeconds(songDuration)

    if (song) {
        return (
            <li style={{ listStyleType: 'none' }}>

                <Box
                    onClick={handleClick}
                    sx={{
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
                        <img src={song.album.images[0].url} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            {song.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {song.artists[0].name}
                        </Typography>
                    </Box>

                    {/* Song Duration */}
                    <Box sx={{ marginLeft: 'auto', marginRight: '10px' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '400' }}>
                            {formattedDuration}
                        </Typography>
                    </Box>
                </Box>
            </li>
        );
    }

}

export default SongMedium;
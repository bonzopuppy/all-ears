import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayHover from './PlayHover';
import TrackContextMenu from './TrackContextMenu';
import { useMusicContext } from './MusicContext';
import { useNavigate } from 'react-router-dom';
import { useStartJourney } from '../journey/useStartJourney';

function SongMedium({song}) {
    const { playTrack, addToQueue, addToQueueNext } = useMusicContext();
    const navigate = useNavigate();
    const startJourney = useStartJourney();
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleClick = () => {
        if (song) {
            playTrack(song);
        }
    };

    const handleMenuOpen = (event) => {
        event.stopPropagation(); // Prevent triggering the track click
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleAddToQueue = () => {
        addToQueue(song);
    };

    const handlePlayNext = () => {
        addToQueueNext(song);
    };

    const handleGoToAlbum = () => {
        if (song?.album?.id) {
            navigate(`/album/${song.album.id}`);
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
                    justifyContent: 'space-between',
                    position: 'relative',
                    paddingRight: '8px',
                    '&:hover': {
                        backgroundColor: 'rgba(24, 28, 30, 0.12)', // Increased shading for better contrast
                        cursor: 'pointer',
                        borderRadius: '8px',
                        // Show the play button on hover
                        '.playHover': {
                            visibility: 'visible',
                            opacity: 1,
                            transition: 'opacity 0.3s ease'
                        },
                        // Show the three-dot menu on hover
                        '.menuButton': {
                            visibility: 'visible',
                            opacity: 1,
                            transition: 'opacity 0.3s ease'
                        }
                    }
                }}>


                    {/* Album Image */}
                    <Box sx={{ width: '64px', height: '64px', marginRight: '10px', marginLeft: '10px', position: 'relative' }}>
                        <img src={song.album?.images?.[0]?.url || song.image || 'https://via.placeholder.com/64'} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                            {song.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {song.artists?.[0]?.name || song.artist || 'Unknown Artist'}
                        </Typography>
                    </Box>

                    {/* Duration and Menu Container */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Song Duration */}
                        <Typography variant="subtitle1" sx={{ fontWeight: '400' }}>
                            {formattedDuration}
                        </Typography>

                        {/* Three-dot Menu Button */}
                        <IconButton
                            className="menuButton"
                            onClick={handleMenuOpen}
                            sx={{
                                visibility: 'hidden',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                color: 'primary.main',
                                '&:hover': {
                                    color: 'secondary.main',
                                    backgroundColor: 'rgba(255, 110, 29, 0.08)',
                                }
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Context Menu */}
                <TrackContextMenu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    onAddToQueue={handleAddToQueue}
                    onPlayNext={handlePlayNext}
                    onGoToAlbum={handleGoToAlbum}
                    onStartJourney={() => startJourney({
                        nodeType: 'track',
                        nodeId: song.id,
                        nodeName: song.name
                    })}
                />
            </li>
        );
    }

}

export default SongMedium;
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayHover from './PlayHover';
import TrackContextMenu from './TrackContextMenu';
import { useMusicContext } from './MusicContext';
import { useNavigate } from 'react-router-dom';

function SongSmall({hotTrack}) {
    const { playTrack, addToQueue, addToQueueNext } = useMusicContext();
    const navigate = useNavigate();
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleClick = () => {
        if (hotTrack) {
            playTrack(hotTrack);
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
        addToQueue(hotTrack);
    };

    const handlePlayNext = () => {
        addToQueueNext(hotTrack);
    };

    const handleGoToAlbum = () => {
        if (hotTrack?.album?.id) {
            navigate(`/album/${hotTrack.album.id}`);
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
                justifyContent: 'space-between',
                position: 'relative',
                height: 76,
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
        

                {/* Song Info and Menu Container */}
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                    {/* Song Info */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                            {hotTrack.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {hotTrack.artists[0].name}
                        </Typography>
                    </Box>

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
            />
        </li>
    );
}

export default SongSmall;
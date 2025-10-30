import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PlayHover from './PlayHover';
import { useMusicContext } from './MusicContext';

function AlbumMedium({album}) {
    const { playTrack } = useMusicContext();

    const handleClick = () => {
        if (album) {
            // Create a track object from album data
            const albumTrack = {
                name: album.name,
                artists: album.artists,
                album: {
                    images: album.images,
                    name: album.name
                },
                uri: album.uri,
                duration_ms: 0
            };
            playTrack(albumTrack);
        }
    };

    if (album) {
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
                        backgroundColor: 'rgba(24, 28, 30, 0.08)',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        '.playHover': {
                            visibility: 'visible',
                            opacity: 1,
                            transition: 'opacity 0.3s ease'
                        }
                    }
                }}>


                    {/* Album Image */}
                    <Box sx={{ width: '64px', height: '64px', marginRight: '10px', marginLeft: '10px', position: 'relative' }}>
                        <img src={album.images[0].url} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
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



                    {/* Album Info */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                            {album.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {album.artists[0].name}
                        </Typography>
                    </Box>

                    {/* Release Date */}
                    <Box sx={{ marginLeft: 'auto', marginRight: '10px' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: '400', color: 'text.secondary' }}>
                            {album.release_date ? new Date(album.release_date).getFullYear() : ''}
                        </Typography>
                    </Box>
                </Box>
            </li>
        );
    }

}

export default AlbumMedium;

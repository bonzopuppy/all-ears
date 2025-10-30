import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import PlayHover from './PlayHover';
import { useMusicContext } from './MusicContext';

function AlbumMedium({album, accessToken, spotifyAPI}) {
    const { playTrack } = useMusicContext();

    const handleClick = async () => {
        if (!album || !accessToken) return;

        try {
            // Extract album ID from URI (spotify:album:xxx)
            const albumId = album.id || album.uri.split(':')[2];

            // Fetch album tracks from Spotify API
            const response = await fetch(`${spotifyAPI}/albums/${albumId}/tracks?limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch album tracks:', response.status);
                alert('Unable to play this album. Please try another.');
                return;
            }

            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const firstTrack = data.items[0];
                // Create a proper track object with album info
                const trackToPlay = {
                    ...firstTrack,
                    album: {
                        images: album.images,
                        name: album.name
                    }
                };
                playTrack(trackToPlay);
            }
        } catch (error) {
            console.error('Error playing album:', error);
            alert('Unable to play this album. Please try another.');
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

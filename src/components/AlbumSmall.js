import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import musicPlayerAlbum from '../images/musicPlayerAlbum.png';
import PlayHover from './PlayHover';
import { useMusicContext } from './MusicContext';

function AlbumSmall({release, accessToken, spotifyAPI}) {
    const { playTrack } = useMusicContext();

    const handleClick = async () => {
        if (!release || !accessToken) return;

        try {
            // Extract album ID from URI (spotify:album:xxx)
            const albumId = release.id || release.uri.split(':')[2];

            console.log('🎵 Clicking album:', release.name, 'by', release.artists[0].name);
            console.log('🆔 Album ID:', albumId);

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
            console.log('📀 Fetched tracks:', data);

            if (data.items && data.items.length > 0) {
                const firstTrack = data.items[0];
                console.log('▶️ Playing first track:', firstTrack.name);

                // Create a proper track object with album info
                const trackToPlay = {
                    ...firstTrack,
                    album: {
                        images: release.images,
                        name: release.name
                    }
                };
                playTrack(trackToPlay);
            }
        } catch (error) {
            console.error('Error playing album:', error);
            alert('Unable to play this album. Please try another.');
        }
    };

    if (!release) {
        return null; // or return a loading spinner
    }

    console.log('🖼️ Displaying album in New Releases:', release.name, 'by', release.artists[0].name);

    return (

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
                    <img src={release.images[0].url} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
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
                        {release.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {release.artists[0].name}
                    </Typography>
                </Box>

            </Box>
        </li>
    );
}

export default AlbumSmall;
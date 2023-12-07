import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import musicPlayerAlbum from '../images/musicPlayerAlbum.png';

function SongItem() {
    return (
        <li style={{ listStyleType: 'none' }}>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                {/* Album Image */}
                <Box sx={{ width: '64px', height: '64px', marginRight: '10px', marginLeft: '10px' }}>
                    <img src={musicPlayerAlbum} alt="Album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>

                {/* Song Info */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                        Get Up Offa That Thing
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Artist Name
                    </Typography>
                </Box>

            </Box>
        </li>
    );
}

export default SongItem;
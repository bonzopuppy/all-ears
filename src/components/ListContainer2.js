import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import AlbumPlaylistItem from './AlbumPlaylistItem';
import ArtistItem from './ArtistItem';
import coverImage from '../images/coverImage.png';
import artistImage from '../images/artistImage.png';

function ListContainer({ title }) {
    return (
        <Box sx={{
            width: 413,
            height: 300,
            backgroundColor: '#F4F2F7',
            padding: '10px', // Adjust padding as needed
            borderRadius: '8px', // Optional: if you want rounded corners
            boxSizing: 'border-box', // Ensures padding doesn't affect width
        }}>
            {/* Title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0 20px 8px' }}>
                <Typography variant="h6">{title}</Typography>
                <Link href="#" sx={{ textDecoration: 'none', fontWeight: '500', color: 'primary.main', fontFamily: "'Prompt', sans serif", margin: '3px 12px 0 0', '&:hover': { color: 'secondary.main' }, fontSize: '14px'}}>View All</Link>
            </Box>

            {/* List Items */}
            <Box component="ul" sx={{ 
                display: 'flex',  // Set display to flex
                flexDirection: 'row', // Align items side by side
                justifyContent: 'center', // Adjust space between items
                padding: 0, 
                margin: 0, 
                gap: '24px', // Space between ListContainer components
                listStyleType: 'none', 
            }}>
                <AlbumPlaylistItem
                    imageUrl={coverImage}
                    textLine1="The Beatles"
                    textLine2="Abbey Road"
                />
                <ArtistItem
                    imageUrl={artistImage}
                    textLine1="Ariane Grande"
                    albumCount="16"
                    songCount="187"
                />
            </Box>
        </Box>
    );
}

export default ListContainer;

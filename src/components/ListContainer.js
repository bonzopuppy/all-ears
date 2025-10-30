import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// import musicPlayerAlbum from './musicPlayerAlbum.png';
import AlbumSmall from './AlbumSmall';

function ListContainer({ title, newReleases }) {

    return (
        <Box sx={{
            width: 413,
            height: 337,
            backgroundColor: '#F4F2F7',
            padding: '10px', // Adjust padding as needed
            borderRadius: '8px', // Optional: if you want rounded corners
            boxSizing: 'border-box', // Ensures padding doesn't affect width
        }}>
            {/* Title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0 20px 8px' }}>
                <Typography variant="h6">{title}</Typography>
                <Link
                    component={RouterLink}
                    to="/new-releases"
                    sx={{ textDecoration: 'none', fontWeight: '500', color: 'primary.main', fontFamily: "'Prompt', sans serif", margin: '3px 12px 0 0', '&:hover': { color: 'secondary.main' }, fontSize: '14px'}}>
                    View All
                </Link>
            </Box>

            {/* List Items */}
            <Box component="ul" sx={{ 
                padding: 0, 
                margin: 0, 
                listStyleType: 'none', 
                '& > li': { 
                    marginBottom: '10px' // Spacing between items
                }
            }}>
                {newReleases && newReleases.map(release => <AlbumSmall release={release} /> )}
            </Box>
        </Box>
    );
}

export default ListContainer;

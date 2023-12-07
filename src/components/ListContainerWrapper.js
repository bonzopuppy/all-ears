import React from 'react';
import Box from '@mui/material/Box';
import ListContainer from './ListContainer'; // Import your ListContainer component
import ListContainer2 from './ListContainer2'; // Import your ListContainer component

function ListContainerWrapper() {
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap', // Allows items to wrap to the next line
            justifyContent: 'space-between', // Adjusts space between items
            maxWidth: 1296,
            margin: '0 auto', // Centers the container
            padding: '0 30px', // Similar to the search bar
            gap: '20px' // Space between ListContainer components
        }}>
            <ListContainer title={"New Releases"} />
            <ListContainer title={"What's Hot"}/>
            <ListContainer2 title={"Recent"}/>
        </Box>
    );
}

export default ListContainerWrapper;

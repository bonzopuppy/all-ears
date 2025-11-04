import React from 'react';
import Box from '@mui/material/Box';
import ListContainer from './ListContainer'; // Import your ListContainer component
import ListContainer2 from './ListContainer2'
import ListContainer3 from './ListContainer3'; // Import your ListContainer component

function ListContainerWrapper({newReleases, forYou, recentlyPlayed, handleRefresh, accessToken, spotifyAPI, newReleasesCategoryId, newReleasesCategoryTitle, forYouCategoryId, forYouCategoryTitle}) {
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
            <ListContainer
                title={newReleasesCategoryTitle}
                newReleases={newReleases}
                accessToken={accessToken}
                spotifyAPI={spotifyAPI}
                viewAllLink={newReleasesCategoryId ? `/genre/${newReleasesCategoryId}` : '/new-releases'}
            />
            <ListContainer2
                title={forYouCategoryTitle}
                items={forYou}
                handleRefresh={handleRefresh}
                viewAllLink={forYouCategoryId ? `/genre/${forYouCategoryId}` : '/for-you'}
            />
            <ListContainer3 title={"Recent Selections"} recentlyPlayed={recentlyPlayed}/>

        </Box>
    );
}

export default ListContainerWrapper;

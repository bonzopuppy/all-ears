import { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function SearchBar({getAccessToken, spotifyAPI}) {

    const [searchQuery, setSearchQuery] = useState('')

    function handleQueryChange(e) {
        setSearchQuery(e.target.value)
    }

    async function handleSubmit(e) {
        if (e.key === 'Enter') {
        e.preventDefault()

        const formattedQuery = encodeURIComponent(searchQuery)
        const searchUrl = `${spotifyAPI}/search?q=${formattedQuery}&type=track,artist,album,playlist&limit=10`

        const accessToken = await getAccessToken()

        const response = await fetch(`${searchUrl}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const data = await response.json()
        console.log(data)

        setSearchQuery("");
        
    }
    }

    return (
    
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '0 30px' }}>
                <TextField
                    fullWidth
                    placeholder="What do you want to listen to?"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleQueryChange}
                    onKeyDown={handleSubmit}
                    sx={{
                        maxWidth: '1296px', // Maximum width
                        width: '100%', // Ensure it takes up the available space
                        height: 64, // Height of the search bar
                        marginTop: '1.5em',
                        marginBottom: '1em',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px', // Rounded corners
                            backgroundColor: '#F4F2F7', // Background color
                            '& fieldset': {
                                border: 'none', // Removes the default border
                            },
                            '&:hover fieldset': {
                                border: '1px solid #181C1E'
                            },
                            '&.Mui-focused fieldset': {
                                border: '1px solid #181C1E'
                            },
                            '& .MuiInputBase-input': { // Targeting the input text
                                fontWeight: '500', // Change font weight here
                            },
                        },
                    }}
                />
            </Box>
        );
}

export default SearchBar;
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const allEarsClientId = "600f950452a84657b5a28a42c739ceac"
const allEarsClientSecret = "21203cc6dd96448d9e1751b1debe3e38"

const spotifyAPI = "https://api.spotify.com/v1"

async function getAccessToken(clientId = allEarsClientId, clientSecret = allEarsClientSecret) {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    })

    const data = await result.json();
    return data.access_token;
}

function SearchBar() {

    const [searchQuery, setSearchQuery] = useState('')

    function handleQueryChange(e) {
        setSearchQuery(e.target.value)
    }

    async function handleSubmit(e) {
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

        setSearchQuery("")
    }

    return (
        // <div>
        //     <form onSubmit={handleSubmit}>
        //         <input 
        //             id="search-input"
        //             type="text"
        //             placeholder="Search tracks, artists, and more..."
        //             value={searchQuery}
        //             onChange={handleQueryChange}
        //         />
        //         <button type="submit">Search</button>
        //     </form>
        // </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '0 30px' }}>
                <TextField
                    fullWidth
                    placeholder="What do you want to listen to?"
                    variant="outlined"
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
                                border: 'none', // Removes border on hover
                            },
                            '&.Mui-focused fieldset': {
                                border: 'none', // Removes border on focus
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
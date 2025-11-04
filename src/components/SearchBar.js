import { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { spotifyAPI } from '../api/spotify-client';

function SearchBar({ accessToken, onResultsFetched, searchQuery, setSearchQuery }) {
    function handleQueryChange(e) {
        setSearchQuery(e.target.value);
    }

    function clearSearch() {
        setSearchQuery('');
        if (onResultsFetched) {
            onResultsFetched(null);
        }
    }

    async function handleSubmit(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            try {
                const data = await spotifyAPI.search(searchQuery, 'track,artist,album,playlist', 10);

                if (onResultsFetched) {
                    onResultsFetched(data);
                }
            } catch (error) {
                console.error('[SearchBar] Search failed:', error);
            }
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
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchQuery && (
                                <IconButton onClick={clearSearch} style={{ color: '#181C1E' }}>
                                    <CloseIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                }}
                sx={{
                    maxWidth: '1296px',
                    width: '100%',
                    height: 64,
                    marginTop: '1.5em',
                    marginBottom: '1em',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#F4F2F7',
                        '& fieldset': {
                            border: 'none',
                        },
                        '&:hover fieldset': {
                            border: '1px solid #181C1E'
                        },
                        '&.Mui-focused fieldset': {
                            border: '1px solid #181C1E'
                        },
                        '& .MuiInputBase-input': {
                            fontWeight: '500',
                        },
                    },
                }}
            />
        </Box>
    );
}

export default SearchBar;

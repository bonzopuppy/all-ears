import { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function ExplorationBar() {

    return (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '0 30px' }}>
                <TextField
                    fullWidth
                    placeholder="Explore the musical unknown..."
                    variant="outlined"
                    // value={searchQuery}
                    // onChange={handleQueryChange}
                    // onKeyDown={handleSubmit}
                    InputProps={{
                        endAdornment: (
                            <Button
                                variant="contained"
                                sx={{
                                    height: 56,
                                    width: 140,
                                    borderRadius: 2,
                                    backgroundColor: '#181C1E',
                                    color: 'white',
                                    margin: '12px 0px',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: '#181C1E',
                                        opacity: 0.92,
                                    },
                                }}
                            >
                                Generate
                            </Button>
                        ),
                    
                    }}
                    sx={{
                        maxWidth: '822px', // Maximum width
                        width: '60%',
                        minWidth: '300px', // Minimum width
                        height: 72, // Height of the search bar
                        marginTop: '1.5em',
                        marginBottom: '1em',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px', // Rounded corners
                            backgroundColor: '#F4F2F7', // Background color
                            '& fieldset': {
                                border: 'none', // Removes the default border
                            },
                            '&:hover fieldset': {
                                border: '1px solid #181C1E', // Removes border on hover
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

export default ExplorationBar;
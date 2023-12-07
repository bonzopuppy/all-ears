import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function GenreComponent({ title, background, imageUrl}) {
    return (
        <Box sx={{
            width: 310,
            height: 170,
            backgroundColor: background,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '8px',
            position: 'absolute',
            overflow: 'hidden',
            // '&::before': {
            //     content: '""',
            //     position: 'relative',
            //     top: 0,
            //     left: 0,
            //     right: 0,
            //     bottom: 0,
            //     backgroundImage: imageUrl,
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center',
            //     // opacity: 0.5,
            //     zIndex: -1000,
            }
        }>
            <Typography variant="h6" sx={{ color: 'white', position: 'relative', zIndex: 2}}>{title}</Typography>
            <img src={imageUrl} alt="genre" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', zIndex: -1000}} />
        </Box>
    );
}

export default GenreComponent;

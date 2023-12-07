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
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // opacity: 0.5,
                zIndex: 1
            },
            ':hover': {
                boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
            }
        }}>
            <Typography variant="h6" sx={{ color: 'white', position: 'relative', zIndex: 2}}>{title}</Typography>
        </Box>
    );
}

export default GenreComponent;

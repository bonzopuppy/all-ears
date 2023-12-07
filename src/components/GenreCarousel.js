import React, { useState } from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import GenreComponent from './GenreComponent';
import blueOvals from '../images/blueOvals.svg';
import orangeOvals from '../images/orangeOvals.svg';
import purpleOvals from '../images/purpleOvals.svg';
import redOvals from '../images/redOvals.svg';
import lightBlueOvals from '../images/lightBlueOvals.svg';

function GenreCarousel() {
    const sliderRef = React.useRef(null);

    function CustomPrevArrow() {
        return (
            <IconButton
                sx={{
                    position: 'absolute',
                    top: '-5px', // Raise the arrow
                    left: 'auto',
                    right: '50px', // Adjust horizontal position as needed
                    zIndex: 1,
                    color: 'primary.main', // Change arrow color
                    backgroundColor: 'white', // Add background color
                    '&:hover': {
                        color: 'secondary.main', // Change on hover
                    },
                }}
                onClick={() => sliderRef.current.slickPrev()}
            >
                <ArrowBackIosIcon sx={{ fontSize: 20 }} />
            </IconButton>
        );
    }

    function CustomNextArrow(s) {
        return (
            <IconButton
                sx={{
                    position: 'absolute',
                    top: '-5px', // Raise the arrow
                    left: 'auto',
                    right: '20px', // Adjust horizontal position as needed
                    zIndex: 1,
                    color: 'primary.main', // Change arrow color
                    backgroundColor: 'white', // Add background color
                    '&:hover': {
                        color: 'secondary.main', // Change on hover
                    },
                    fontSize: '1.2rem' // Increase the size
                }}
                onClick={() => sliderRef.current.slickNext()}
            >
                <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
            </IconButton>
        );
    }

    const settings = {
        // Settings for the carousel (refer to react-slick documentation)
        nextArrow: <div />, // Empty divs to effectively hide default arrows
        prevArrow: <div />,
        appendDots: dots => (
            <div style={{ position: 'absolute', top: '-40px', right: '20px' }}>
                <ul style={{ marginLeft: '0px' }}> {dots} </ul>
            </div>
        ),
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    const genres = [
        { title: 'Rock', background: '#31334F', imageUrl: blueOvals },
        { title: 'Pop', background: '#EA9633', imageUrl: orangeOvals },
        { title: 'Hip Hop', background: '#8340D9', imageUrl: purpleOvals },
        { title: 'Jazz', background: '#E13535', imageUrl: redOvals },
        { title: 'Country', background: '#75C6F4', imageUrl: lightBlueOvals },
        { title: 'Classical', background: '#31334F', imageUrl: blueOvals },
        { title: 'Electronic', background: '#EA9633', imageUrl: orangeOvals },
        { title: 'Folk', background: '#8340D9', imageUrl: purpleOvals },
        { title: 'R&B', background: '#E13535', imageUrl: redOvals },
        { title: 'Reggae', background: '#75C6F4', imageUrl: lightBlueOvals },
        { title: 'Blues', background: '#31334F', imageUrl: blueOvals },
        { title: 'Metal', background: '#EA9633', imageUrl: orangeOvals },
        { title: 'Funk', background: '#8340D9', imageUrl: purpleOvals },
        { title: 'Disco', background: '#E13535', imageUrl: redOvals },
        { title: 'Techno', background: '#75C6F4', imageUrl: lightBlueOvals },
        { title: 'Soul', background: '#31334F', imageUrl: blueOvals },
        { title: 'Punk', background: '#EA9633', imageUrl: orangeOvals },
        { title: 'Gospel', background: '#8340D9', imageUrl: purpleOvals },
        { title: 'Indie', background: '#E13535', imageUrl: redOvals },
        { title: 'Alternative', background: '#75C6F4', imageUrl: lightBlueOvals },
    ];


    return (
        <Box sx={{ width: '1296px', margin: '20px auto', position: 'relative' }}>
            <Typography variant="h6" sx={{ marginBottom: 2, marginLeft: 2, position: 'relative', zIndex: 1 }}>Browse Genres</Typography>
            <CustomPrevArrow />
            <CustomNextArrow />
            <Slider ref={sliderRef} {...settings}>
                {genres.map((genre, index) => (
                    <GenreComponent key={index} title={genre.title} background={genre.background} imageUrl={genre.imageUrl} />
                ))}
            </Slider>
        </Box>
    );
}

export default GenreCarousel;
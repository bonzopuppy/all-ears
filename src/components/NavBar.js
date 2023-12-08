import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import logo from '../images/AELogo.svg';
import { NavLink } from 'react-router-dom';

function NavBar() {
    const [activeLink, setActiveLink] = useState('home');

    const handleLinkClick = (link) => {
        setActiveLink(link);
    }

    return (
        <AppBar position="fixed" style={{ backgroundColor: '#181C1E' }} elevation={0}>
            <Toolbar>
                <NavLink to="/all-ears" style={{ color: 'inherit', textDecoration: 'none' }} onClick={() => handleLinkClick('home')}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <img src={logo} alt="logo" style={{ height: 32, width: 40 }} />
                    </IconButton>
                </NavLink>           
                <NavLink to="/all-ears" style={{ color: 'inherit', textDecoration: 'none'}}>
                  <Typography
                    sx={{
                        marginLeft: '4em',
                        fontSize: '.9em',
                        fontWeight: 500,
                        cursor: 'pointer',
                        color: activeLink === 'home' ? '#FF6E1D' : 'white',
                        position: 'relative', // Needed for absolute positioning of ::after
                        '&::after': {
                          content: '""', // Empty string, necessary for ::after
                          display: activeLink === 'home' ? 'block' : 'none', // Only display if active
                          width: '6px',
                          height: '22px',
                          backgroundColor: '#FF6E1D',
                          position: 'absolute',
                          bottom: '-20px',
                          left: '42%',
                          transform: 'rotate(90deg)',
                          borderRadius: '50%',
                        }
                      }}
                    onClick={() => handleLinkClick('home')}
                  >
                    Home
                  </Typography>
                </NavLink>
                <NavLink to="/library" style={{ color: 'inherit', textDecoration: 'none'}}>
                  <Typography
                    sx={{
                        marginLeft: '4em',
                        fontSize: '.9em',
                        fontWeight: 500,
                        cursor: 'pointer',
                        color: activeLink === 'library' ? '#FF6E1D' : 'white',
                        position: 'relative', // Needed for absolute positioning of ::after
                        '&::after': {
                          content: '""', // Empty string, necessary for ::after
                          display: activeLink === 'library' ? 'block' : 'none', // Only display if active
                          width: '6px',
                          height: '22px',
                          backgroundColor: '#FF6E1D',
                          position: 'absolute',
                          bottom: '-20px',
                          left: '42%',
                          transform: 'rotate(90deg)',
                          borderRadius: '50%',
                        }
                      }}
                    onClick={() => handleLinkClick('library')}
                  >
                    Library
                  </Typography>
                </NavLink>
                <NavLink to="/explore"  style={{ color: 'inherit', textDecoration: 'none'}}>
                  <Typography
                    sx={{
                      marginLeft: '4em',
                      fontSize: '.9em',
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: activeLink === 'explore' ? '#FF6E1D' : 'white',
                      position: 'relative', // Needed for absolute positioning of ::after
                      '&::after': {
                      content: '""', // Empty string, necessary for ::after
                      display: activeLink === 'explore' ? 'block' : 'none', // Only display if active
                      width: '6px',
                      height: '22px',
                      backgroundColor: '#FF6E1D',
                      position: 'absolute',
                      bottom: '-20px',
                      left: '42%',
                      transform: 'rotate(90deg)',
                      borderRadius: '50%',
                    }
                  }}
                    onClick={() => handleLinkClick('explore')}
                  >
                    Explore

                  </Typography>
                </NavLink>

                <Avatar style={{ marginLeft: 'auto', backgroundColor: 'white', color: 'black', fontSize: '.75em', fontWeight: '600', width: 32, height: 32 }}>DB</Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
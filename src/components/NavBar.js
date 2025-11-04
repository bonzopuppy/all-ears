import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import logo from '../images/AELogo.svg';
import { NavLink } from 'react-router-dom';

function NavBar({ user, onLogout }) {
    const [activeLink, setActiveLink] = useState('home');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    }

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        if (onLogout) {
            onLogout();
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user) return 'DB';
        if (user.display_name) {
            const names = user.display_name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.display_name.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

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
                    Assistant

                  </Typography>
                </NavLink>

                <Avatar
                    onClick={handleAvatarClick}
                    style={{
                        marginLeft: 'auto',
                        backgroundColor: 'white',
                        color: 'black',
                        fontSize: '.75em',
                        fontWeight: '600',
                        width: 32,
                        height: 32,
                        cursor: 'pointer'
                    }}
                >
                    {getUserInitials()}
                </Avatar>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {user && (
                        <MenuItem disabled>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.display_name || user.email}
                            </Typography>
                        </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
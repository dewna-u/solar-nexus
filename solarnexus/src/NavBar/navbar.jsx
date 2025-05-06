import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    CssBaseline,
} from '@mui/material';
import {
    Menu as MenuIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    LockOpen as LoginIcon,
    HowToReg as RegisterIcon,
    Feedback as FeedbackIcon,
    ContactMail as ContactIcon,
    Chat as ChatIcon,
    VpnKey as ForgotPasswordIcon,
    WorkspacePremium as MembershipIcon,
    AdminPanelSettings as AdminIcon,
    SolarPower as SolarIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Monitoring', path: '/Monitoring', icon: <SolarIcon /> },
    { label: 'Membership', path: '/MembershipPage', icon: <MembershipIcon /> },
    { label: 'Contact Us', path: '/ContactUs', icon: <ContactIcon /> },
    { label: 'Feedback', path: '/Feedback', icon: <FeedbackIcon /> },
    { label: 'AI Chatbot', path: '/ChatBot', icon: <ChatIcon /> },
];

const NavBar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        document.body.style.backgroundColor = !darkMode ? '#121212' : '#f5f5f5';
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
                ⚡ Solar Monitor
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem
                        button
                        key={item.label}
                        component={Link}
                        to={item.path}
                        sx={{
                            borderRadius: 2,
                            mx: 1,
                            mb: 1,
                            '&:hover': {
                                backgroundColor: darkMode ? '#333' : '#f0f0f0',
                                transform: 'scale(1.03)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <CssBaseline />
            <AppBar
                position="static"
                sx={{
                    background: darkMode
                        ? 'linear-gradient(90deg, #1f1f1f, #2c2c2c)'
                        : 'linear-gradient(90deg, #0D47A1, #1976D2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'background 0.4s ease',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
                        ⚡ Solar Monitor
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                component={Link}
                                to={item.path}
                                startIcon={item.icon}
                                sx={{
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 2,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.08)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                    <IconButton onClick={handleThemeToggle} sx={{ ml: 1, color: '#fff' }}>
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 250,
                        background: darkMode
                            ? 'rgba(18, 18, 18, 0.9)'
                            : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        color: darkMode ? '#fff' : '#000',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default NavBar;

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
    useTheme,
    CssBaseline,
    Switch
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
    { label: 'Monitoring', path: '/MembershipPage', icon: <SolarIcon /> },
    { label: 'Membership', path: '/MembershipPage', icon: <MembershipIcon /> },
    { label: 'Contact Us', path: '/ContactUs', icon: <ContactIcon /> },
    { label: 'Feedback', path: '/Feedback', icon: <FeedbackIcon /> },
    { label: 'AI Chatbot', path: '#ai-chatbot', icon: <ChatIcon /> },
];

const NavBar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        document.body.style.backgroundColor = !darkMode ? '#121212' : '#fff';
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Solar Monitor
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem button key={item.label} component={Link} to={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
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
                    backgroundColor: darkMode ? '#1f1f1f' : '#0D47A1',
                    transition: 'background-color 0.3s ease',
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
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Solar Monitor
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
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        backgroundColor: 'rgba(255,255,255,0.1)'
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
                        boxSizing: 'border-box',
                        width: 250,
                        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
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

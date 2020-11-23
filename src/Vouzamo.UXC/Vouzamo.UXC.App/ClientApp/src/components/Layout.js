import React, { useState, createContext } from 'react';

import { useAuth0 } from '@auth0/auth0-react';

import { Link } from 'react-router-dom';

import { Container, AppBar, Drawer, Divider, List, ListItem, ListItemText, Toolbar, Typography, IconButton, Slide, Button, useScrollTrigger, Menu, MenuItem } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Lock as LockIcon, ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { TenantSelector } from './TenantHome';

const unknownTenant = undefined;

export const TenantContext = createContext([]);

const HideOnScroll = ({ children }) => {

    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export const LoginLogoutButton = () => {

    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (isAuthenticated) {
        return (
            <>
                <IconButton color="inherit" aria-controls="auth-menu" aria-haspopup="true" onClick={handleClick}>
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    id="auth-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={() => { logout({ returnTo: window.location.origin }); }}>Sign out</MenuItem>
                </Menu>
            </>
        );
    }

    return (
        <Button variant="outlined" color="inherit" startIcon={<LockIcon />} onClick={loginWithRedirect}>Sign In</Button>
    );

}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    authMenu: {
        //marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        minWidth: "240px"
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    main: {
        marginTop: theme.spacing(4)
    }
}));

export const Layout = ({ children }) => {

    const { isLoading, error, isAuthenticated } = useAuth0();

    const [tenant, setTenant] = useState(unknownTenant);
    const [drawer, setDrawer] = useState(false);

    const classes = useStyles();

    return (
        <div className={ classes.root }>
            <HideOnScroll>
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={ () => setDrawer(true) }>
                            <MenuIcon />
                        </IconButton>
                        <Typography className={ classes.title } variant="h6">UXC</Typography>
                        <div className={ classes.authMenu }>
                            { isAuthenticated &&
                                <TenantSelector tenant={tenant} />
                            }
                            <LoginLogoutButton />
                        </div>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
                <div className={classes.drawer}>
                    <div className={classes.toolbar}>
                        <IconButton onClick={() => setDrawer(false)}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List onClick={ () => setDrawer(false) }>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={Link} to="/counter">
                            <ListItemText primary="Counter" />
                        </ListItem>
                        <ListItem button component={Link} to="/fetch-data">
                            <ListItemText primary="Fetch" />
                        </ListItem>
                    </List>
                    {tenant !== unknownTenant &&
                        <>
                            <Divider />
                            <List onClick={() => setDrawer(false)}>
                                <ListItem button component={Link} to={`/tenant/${tenant}/navigator/`}>
                                    <ListItemText primary="Navigator" />
                                </ListItem>
                            </List>
                        </>
                    }
                </div>
            </Drawer>

            {isLoading && 
                <Container maxWidth="lg">Loading...</Container>
            }

            {error &&
                <Container maxWidth="lg">Oops... {error.message}</Container>
            }

            <TenantContext.Provider value={[tenant, setTenant]}>
                <Container className={classes.main} maxWidth="lg">{children}</Container>
            </TenantContext.Provider>
            
        </div>
    );
}

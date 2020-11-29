import React, { useState, useContext } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

import { TenantContext } from '../context/Context';

import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, Button, IconButton } from '@material-ui/core';
import { Language as SpaceIcon, Folder as FolderIcon, Code as ContractIcon, GridOn as FragmentIcon, LineStyle as CompositionIcon, AccountCircle as AccountCircleIcon, Lock as LockIcon } from '@material-ui/icons';

const LeftAlignedButton = withStyles({
    label: {
        justifyContent: 'flex-start'
    }
})(Button);

export const ItemButton = ({ item, isEditorLink }) => {

    const [tenant] = useContext(TenantContext);

    const icon = () => {
        switch (item.type) {
            case 1:
                return <SpaceIcon />
            case 2:
                return <FolderIcon />
            case 4:
                return <ContractIcon />
            case 8:
                return <FragmentIcon />
            case 16:
                return <CompositionIcon />
            default:
                return null;
        }
    }

    return (
        isEditorLink ? <LeftAlignedButton variant="text" fullWidth color="inherit" startIcon={icon()} component={Link} to={`/tenant/${tenant}/editor/${item.id}`}>{item.name}</LeftAlignedButton> : <LeftAlignedButton variant="text" fullWidth color="inherit" startIcon={icon()}>{item.name}</LeftAlignedButton>
    );
}

export const LoginLogoutButton = () => {

    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);

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
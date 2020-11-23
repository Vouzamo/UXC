import React, { useState, useContext, useEffect } from 'react';

import { Route, Link, useParams, useLocation, useHistory } from 'react-router-dom';

import { Grid, Divider, Button, Menu, MenuItem } from '@material-ui/core';
import { UnfoldMore as UnfoldMoreIcon } from '@material-ui/icons';

import { TenantContext } from './Layout';
import { ItemNavigator, TreeSelector } from './Navigator';

const unknownTenant = undefined;

export const TenantRoute = ({ match }) => {

    const { tenant: tenantParam } = useParams();
    const [ tenant, setTenant ] = useContext(TenantContext);

    useEffect(() => {
        if (tenant !== tenantParam) {
            setTenant(tenantParam);
        }
    });

    if (tenantParam !== "omron" && tenantParam !== "dept" && tenantParam !== "vouzamo") {
        return <h2>You don't have permission to access this tenant...</h2>;
    }

    return (
        <>
            <Route exact path={`${match.url}/`} component={TenantHome} />
            <Route exact path={`${match.url}/navigator/:itemId?`} component={TenantNavigator} />
        </>
    )

}

function useQuery(name) {
    let params = new URLSearchParams(useLocation().search);

    return params.get(name);
}

export const TenantHome = () => {

    const [tenant] = useContext(TenantContext);

    return (
        <>
            <h1>Welcome to the tenant area</h1>
            <p>You are using tenant: {tenant}</p>
        </>
    )
}

export const TenantNavigator = () => {

    const history = useHistory();
    const { itemId } = useParams();

    const [selectedItem, selectItem] = useState({ id: itemId, children: [] });
    const [tenant] = useContext(TenantContext);

    // This sort of works but we don't have the childItems before onChange is triggered. Might be better to just either make the childItems a context that can be shared or make additional round trips for the other component(s)
    const onChange = (item) => {

        history.push(`/tenant/${tenant}/navigator/${item.id}`);

        selectItem(item);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
                <TreeSelector tenant={tenant} initialSelection={itemId} onSelected={onChange} />
            </Grid>
            <Grid item xs={12} md={9}>
                <h1>Welcome to the tenant navigator</h1>
                <p>You are using tenant: {tenant} and have selected item: {selectedItem.id}</p>
                <ul>
                    {selectedItem.children.filter(child => child.type !== 1 && child.type !== 2).map((child, i) => {
                        return (<li key={i}>{child.name}</li>)
                    })}
                </ul>
            </Grid>
        </Grid>
    )

}

export const TenantSelector = ({ tenant }) => {

    const tenants = [
        "dept",
        "vouzamo",
        "omron"
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (tenant) => {
        setAnchorEl(null);
    }

    return (
        <>
            <Button variant="outlined" color="inherit" aria-controls="tenant-menu" aria-haspopup="true" onClick={handleClick} startIcon={<UnfoldMoreIcon />}>{tenant === unknownTenant ? "Choose tenant" : tenant}</Button>
            <Menu
                id="tenant-menu"
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
                {tenants && tenants.map((value, index) => <MenuItem key={index} component={Link} to={ `/tenant/${value}/` } onClick={ () => handleChange(value) }>{value}</MenuItem>)}
                <Divider />
                <MenuItem onClick={handleClose}>Create Tenant</MenuItem>
            </Menu>
        </>
    );
}
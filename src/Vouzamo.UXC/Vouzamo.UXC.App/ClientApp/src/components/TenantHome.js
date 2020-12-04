import React, { useState, createContext, useContext, useEffect } from 'react';

import { Route, Link, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Divider, Breadcrumbs, Tabs, Tab, Box, Typography, Button, Menu, MenuItem } from '@material-ui/core';
import { UnfoldMore as UnfoldMoreIcon } from '@material-ui/icons';

import { TenantContext } from './context/Context';
import { TreeSelector } from './Navigator';
import { ItemButton } from './routing/CallToAction';

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
            <Route exact path={`${match.url}/editor/:itemId?`} component={TenantEditor} />
        </>
    )

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

const initialState = {
    rootItems: [],
    childItems: {},
    selectedItem: undefined,
    expandedItems: []
}

export const NavigatorContext = createContext(initialState);

export const ItemBreadcrumb = ({ itemId }) => {

    const [nodes, setNodes] = useState([]);

    useEffect(() => {

        fetch(`/items/${itemId}/breadcrumb`)
            .then((response) => {
                response.json()
                    .then((data) => {
                        setNodes(data);
                })
            })

    }, [itemId])

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {nodes && nodes.map((node, i) => {
                return <ItemButton key={ i } item={ node } isEditorLink />
            })}
        </Breadcrumbs>
    )

}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

const TabPanel = ({ children, value, index, ...other }) => {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export const TenantEditor = () => {

    const { itemId } = useParams();
    const classes = useStyles();

    const [tab, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ItemBreadcrumb itemId={ itemId } />
                        </Grid>
                        <Grid item xs={12}>
                            <p>{ itemId }</p>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab label="General" id="tab-1" aria-controls="tab-1" />
                        <Tab label="Child Items" id="tab-2" aria-controls="tab-2" />
                        <Tab label="Information" id="tab-3" aria-controls="tab-3" />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        General
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        Child Items
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        Information
                    </TabPanel>
                </Paper>
            </Grid>
        </Grid>
    );

}

export const TenantNavigator = () => {

    const { itemId } = useParams();

    const [state, setState] = useState({
        rootItems: [],
        childItems: {},
        selectedItem: itemId,
        expandedItems: []
    });

    const [tenant] = useContext(TenantContext);

    return (
        <NavigatorContext.Provider value={[state, setState]}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <TreeSelector tenant={ tenant } />
                </Grid>
                <Grid item xs={12} md={9}>
                    <h1>Welcome to the tenant navigator</h1>
                    <p>You are using tenant: {tenant} and have selected item: {state.selectedItem}</p>
                    {state.childItems[state.selectedItem] &&
                        <div>
                            {state.childItems[state.selectedItem].filter(child => child.type !== 1 && child.type !== 2).map((child, i) => {
                                return (<div key={i}><ItemButton item={child} isEditorLink /></div>)
                            })}
                        </div>
                    }
                </Grid>
            </Grid>
        </NavigatorContext.Provider>
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
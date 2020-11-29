import React, { useState, useContext, useEffect } from 'react';

import { useHistory, Link } from 'react-router-dom';

import { Menu, MenuItem } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';

import { NavigatorContext } from './TenantHome';
import { TenantContext } from './context/Context';
import { ItemButton } from './routing/CallToAction';

const filter = child => child.type === 1 || child.type === 2;

export const TreeSelector = ({ tenant }) => {

    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const [state, setState] = useContext(NavigatorContext);

    useEffect(() => {

        const fetchData = async () => {

            if (loading) {

                let loadRootItemsData = state.rootItems;

                if (state.rootItems.length === 0) {
                    let loadRootItems = await await fetch('/items/');
                    loadRootItemsData = await loadRootItems.json();
                }

                let selectedItem = state.selectedItem ?? loadRootItemsData[0].id;

                let expandedItemIds = [selectedItem]; // not sure if this works

                if (state.selectedItem) {
                    let loadBreadcrumb = await fetch(`/items/${selectedItem}/breadcrumb`);
                    let loadBreadcrumbData = await loadBreadcrumb.json();

                    console.log(loadBreadcrumbData);

                    expandedItemIds = loadBreadcrumbData.map((item) => item.id);
                }

                setState((oldState) => {
                    return {
                        ...oldState,
                        rootItems: loadRootItemsData,
                        expandedItems: expandedItemIds,
                        selectedItem: selectedItem
                    };
                });
                setLoading(false);
            }
            
        };

        fetchData();

    }, []);

    if (loading) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <TreeView selected={state.selectedItem ?? null} onNodeSelect={(e, selected) => { setState(oldState => { return { ...oldState, selectedItem: selected }; }); history.push(`/tenant/${tenant}/navigator/${selected}`); }} expanded={state.expandedItems} onNodeToggle={(e, expanded) => setState(oldState => { return { ...oldState, expandedItems: expanded }; })} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
            {state.rootItems.filter(filter).map((child, i) => {
                return (
                    <LazyTreeItem key={`${child.id}_${state.childItems[child.id]?.length}`} item={child}></LazyTreeItem>
                );
            })}
        </TreeView>
    )
}

const initialMenuState = {
    mouseX: null,
    mouseY: null
}

const LazyTreeItem = ({ item }) => {

    const [tenant] = useContext(TenantContext);

    const [state, setState] = useContext(NavigatorContext);

    const [menu, setMenu] = useState(initialMenuState);

    const handleMenuClick = (event) => {
        event.preventDefault();
        setMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleMenuClose = () => {
        setMenu(initialMenuState);
    };

    useEffect(() => {

        if (state.childItems[item.id] === undefined) {

            fetch(`/items/${item.id}/children`) // Call the fetch function passing the url of the API as a parameter
                .then((resp) => resp.json())
                .then(function (data) {

                    var updated = state.childItems;

                    updated[`${item.id}`] = data;

                    setState(oldState => { return { ...oldState, childItems: updated }; });

                })
                .catch(function (error) {
                    // This is where you run code if the server returns any errors
                });

        }

    }, []);

    return (
        <div onContextMenu={handleMenuClick}>
            <TreeItem nodeId={item.id} label={<ItemButton item={item} />}>
                {(state.childItems[item.id] ?? []).filter(filter).map((child) => {
                    return (
                        <LazyTreeItem key={`${child.id}_${state.childItems[child.id]?.length}`} item={child}></LazyTreeItem>
                    );
                })}
            </TreeItem>
            <Menu
                keepMounted
                open={menu.mouseY !== null}
                onClose={handleMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    menu.mouseY !== null && menu.mouseX !== null
                        ? { top: menu.mouseY, left: menu.mouseX }
                        : undefined
                }
            >
                <MenuItem component={Link} to={`/tenant/${tenant}/editor/${item.id}`}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose}>Print</MenuItem>
                <MenuItem onClick={handleMenuClose}>Highlight</MenuItem>
                <MenuItem onClick={handleMenuClose}>Email</MenuItem>
            </Menu>
        </div>
    );

}
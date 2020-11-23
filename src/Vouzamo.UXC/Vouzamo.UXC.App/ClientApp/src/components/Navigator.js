import React, { useState, useEffect } from 'react';

import { TreeView, TreeItem } from '@material-ui/lab';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';

export const TreeSelector = ({ tenant, initialSelection, onSelected }) => {

    const [rootItems, setRootItems] = useState(undefined);
    const [expandedItems, setExpandedItems] = useState(undefined);
    const [childItems, setChildItems] = useState({});

    useEffect(() => {

        if (rootItems === undefined) {
            fetch('/items/')
                .then((resp) => resp.json())
                .then(function (data) {
                    setRootItems(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            setRootItems([]);
        }

        if (initialSelection) {

            console.log(initialSelection);

            fetch(`/items/${initialSelection}/breadcrumb`)
                .then((resp) => resp.json())
                .then(function (data) {
                    let expandedItemIds = data.map((item) => item.id);

                    console.log(expandedItemIds);

                    setExpandedItems(expandedItemIds);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            setExpandedItems([]);
        }

    }, [tenant]);

    const onSelect = (id) => {

        var model = {
            id: id,
            children: childItems[id]
        };

        onSelected(model);

    }

    if (rootItems === undefined || expandedItems === undefined) {
        return (<span>Loading...</span>);
    }

    return (
        <TreeView selected={initialSelection} onNodeSelect={(e, selected) => onSelect(selected)} expanded={expandedItems} onNodeToggle={(e, expanded) => setExpandedItems(expanded)} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
            {rootItems && rootItems.filter(child => child.type === 1 || child.type === 2).map((child) => {
                return (
                    <LazyTreeItem key={`${child.id}_${childItems[child.id]?.length}`} item={child} childItems={childItems} setChildItems={setChildItems}></LazyTreeItem>
                );
            })}
        </TreeView>
    )
}

const LazyTreeItem = ({ item, childItems, setChildItems }) => {

    const [isCached, setIsCached] = useState(childItems[item.id] !== undefined);

    useEffect(() => {

        if (!isCached) {

            fetch(`/items/${item.id}/children`) // Call the fetch function passing the url of the API as a parameter
                .then((resp) => resp.json())
                .then(function (data) {

                    var updated = childItems;

                    updated[`${item.id}`] = data;

                    setChildItems(updated);
                    setIsCached(true);

                })
                .catch(function (error) {
                    // This is where you run code if the server returns any errors
                });

        }

    });

    return (
        <TreeItem nodeId={item.id} label={item.name}>
            {childItems[item.id] !== undefined && childItems[item.id].filter(child => child.type === 1 || child.type === 2).map((child) => {
                return (
                    <LazyTreeItem key={`${child.id}_${childItems[child.id]?.length}`} item={child} childItems={childItems} setChildItems={setChildItems}></LazyTreeItem>
                );
            })}
        </TreeItem>
    );

}
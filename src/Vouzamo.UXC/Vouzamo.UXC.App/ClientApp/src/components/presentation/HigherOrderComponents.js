﻿import React from 'react';

import { useScrollTrigger, Slide } from '@material-ui/core';

export const HideOnScroll = ({ children }) => {

    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}
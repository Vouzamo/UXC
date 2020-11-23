import React from 'react';

import { Route } from 'react-router';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { TenantRoute } from './components/TenantHome';

import './custom.css'

export default () => {

    const auth0 = {
        domain: "vouzamous.us.auth0.com",
        clientId: "JnFvP0Xf5QiQ1GZbs93tNQb2d6jcPre2",
        redirectUri: `${window.location.origin}`
    };

    return (
        <Auth0Provider {...auth0}>
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <SecureRoute path='/fetch-data' component={FetchData} />
                <SecureRoute path='/tenant/:tenant' component={TenantRoute} />
            </Layout>
        </Auth0Provider>
    );
}

const SecureRoute = ({ component: Component, ...rest }) => {

    const { isAuthenticated } = useAuth0();

    return (
        <Route {...rest} render={(props) => (
            isAuthenticated ? <Component {...props} /> : <h1>Login please...</h1>
        )} />
    );
}
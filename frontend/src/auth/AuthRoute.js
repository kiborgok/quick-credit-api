import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';

const AuthRoute = ({ path, component: Component }) => {
    const auth = JSON.parse(localStorage.getItem('jwt'));
    return (
        <Route
            path={path}
            render={props => (
                auth ? <Redirect to='/' /> : <Component {...props} />
            )}
        />
    )
};

export default withRouter(AuthRoute);
import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';

const ProtectedRoute = ({ path, component: Component }) => {
    const auth = JSON.parse(localStorage.getItem('jwt'));
    return (
        <Route
            path={path}
            render={props => (
                auth ? <Component {...props} /> : <Redirect to='/login' />
            )}
        />
    )
};

export default withRouter(ProtectedRoute);
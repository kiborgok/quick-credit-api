import React from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    const auth = JSON.parse(localStorage.getItem('jwt'));
    return (
        <main role="main" className="inner cover">
        <h1 className="cover-heading">{auth ? auth.user === 'Admin' ? `Welcome Admin` : `Welcome ${auth.username}` : `Welcome to Quick credit`}</h1>
        <p className="lead">Easy, Simple and Quick way to get a loan.</p>
            {
                auth ? null : < p className="lead" >
                    <NavLink to={"/login"} className="btn btn-lg btn-secondary">Sign In</NavLink>
                </p>
            }
        </main>
    );
}

export default Dashboard;
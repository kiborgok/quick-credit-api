import React from 'react';

const Dashboard = () => {
    const auth = JSON.parse(localStorage.getItem('jwt'));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: '2px' }}>{auth ? auth.user === 'Admin' ? `Welcome Admin` : `Welcome ${auth.username}` : `Welcome to Quick credit`}</h1>
        </div>
    );
}

export default Dashboard;
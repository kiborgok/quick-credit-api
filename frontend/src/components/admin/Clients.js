import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as userActions from '../../redux/actions/userActions';

const mapStateToProps = ({ users, errors }) => ({
    users, errors
});
const mapDispatchToProps = dispatch => ({
    actions: {
        loadUsers: bindActionCreators(userActions.loadUsers, dispatch)
    }
});


const Clients = ({ actions, errors, users }) => {
    const auth = JSON.parse(localStorage.getItem('jwt'))
    useEffect(() => {
        (users.length === 0) && actions.loadUsers({ token: auth.token })
    }, [actions, users, auth]);

    return (
        <>
            <div className='data-form'>
                <header>
                    <h1>Clients</h1>
                </header>
                <p className='error'>{errors}</p>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Second Name</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.firstName}</td>
                                <td>{user.secondName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className={user.status === 'Verified' ? 'verified' : 'unverified'}
                                    >
                                        {user.status}
                                    </button>
                                </td>
                            </tr>
                        )
                        )
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clients));
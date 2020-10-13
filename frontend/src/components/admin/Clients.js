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
            <div>
                <h1 className="h3 mb-3 font-weight-normal">Clients</h1>
                {errors ? <div className="alert alert-danger" role="alert">{errors}</div> : null}
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Second Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.firstName}</td>
                                <td>{user.secondName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span
                                        className={user.status === 'Verified' ? 'badge badge-pill badge-success p-3' : 'badge badge-pill badge-warning p-3'}
                                    >
                                        {user.status}
                                    </span>
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
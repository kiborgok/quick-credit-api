import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../redux/actions/userActions";

const mapStateToProps = ({ errors, users }) => ({ errors, users });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(userActions, dispatch),
});

const Profile = ({ actions, users, errors }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'))
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    users.length === 0 && actions.loadUser({ userId: auth.userId, token: auth.token });
  }, [actions, auth.userId, auth.token, users]);

  useEffect(() => setShowError(false), [])
  return (
    <div className="form-signin">
        <h1 className="h3 mb-3 font-weight-normal">Account Details</h1>
        {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
        {users.length === 0 ? <div className="spinner-border text-primary" role="status">
  <span className="sr-only">Loading...</span>
</div> : (
          <>
            {
            users.map(user => (
              <div className="card text-white bg-dark mb-2" style={{ maxWidth: "25rem"}}>
  <div className="card-body">
    <h5 className="card-title">First Name:</h5>
                  <p className="card-text">{user.firstName}</p>
                  <h5 className="card-title">Second Name:</h5>
                  <p className="card-text">{user.secondName}</p>
                  <h5 className="card-title">Email:</h5>
                  <p className="card-text">{user.email}</p>
  </div>
</div>
              ))
            }
          </>
        )
        }
    </div>
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
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
    <>
      <div className="data-form" style={{ width: "57%" }}>
        <header>
          <h1>Account Details</h1>
        </header>
        <p className='error'>{showError && errors}</p>
        {users.length === 0 ? 'No data' : (
          <>
            {
              users.map(user => (
                <div
                  key={user._id}
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    flexDirection: "column",
                    marginTop: "20px",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0px 2px 10px 0px #185a9d",
                  }}
                >
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>First Name: </em>{" "}
                    {user.firstName}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Second Name:</em>{" "}
                    {user.secondName}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Email:</em>{" "}
                    {user.email}
                  </p>
                </div>
              ))
            }
          </>
        )
        }
      </div>
    </>
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
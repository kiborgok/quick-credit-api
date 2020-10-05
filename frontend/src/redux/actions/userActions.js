import * as userApi from '../../api/userApi';
import * as types from './actionTypes';

export const receiveErrors = error => (
    { type: types.RECEIVE_ERRORS, error: error.error }
);

export const clearErrors = () => (
    { type: types.CLEAR_ERRORS, error: '' }
);

export const signUpUserSuccess = user => (
    { type: types.SIGN_UP_USER_SUCCESS, user: user.data }
);

export const signInUserSuccess = user => (
    { type: types.SIGN_IN_USER_SUCCESS, user: user.data }
);

export const loadUsersSuccess = users => (
    { type: types.LOAD_USERS_SUCCESS, users: users.data }
);

export const loadUserSuccess = user => (
    { type: types.LOAD_USER_SUCCESS, user: user.data }
);

export const verifyUserSuccess = user => (
    { type: types.VERIFY_USER_SUCCESS, user: user.data }
);

export function loadUsers(users) {
    return function (dispatch) {
        return userApi
          .loadUsers(users)
          .then((res) => res.json())
          .then((users) => {
            if (users.data) return dispatch(loadUsersSuccess(users));
            return dispatch(receiveErrors(users));
          });
    };
};

export function loadUser(user) {
    return function (dispatch) {
        return userApi
          .loadUser(user)
          .then((res) => res.json())
          .then((user) => {
            if (user.data) {
              return dispatch(loadUserSuccess(user));
            }
            return dispatch(receiveErrors(user));
          });
    };
};

export function verifyUser(user) {
    return function (dispatch) {
        return userApi
          .verifyUser(user)
          .then((res) => res.json())
          .then((user) => {
            if (user.data) {
              alert("You have successfully verified your account");
              localStorage.removeItem("verificationToken");
              localStorage.removeItem("email");
              return dispatch(verifyUserSuccess(user));
            }
            alert("There was a problem " + user.error);
            return dispatch(receiveErrors(user));
          });
    };
};

export function signup(user) {
    return function (dispatch) {
        return userApi
          .signup(user)
          .then((res) => res.json())
          .then((user) => {
            if (user.data) {
              localStorage.setItem("verify", {
                token: user.data.verificationToken,
                email: user.data.email,
              });
              alert("Check mail to verify your account");
              return dispatch(signInUserSuccess(user));
            }
            return dispatch(receiveErrors(user));
          });
    };
};

export const signin = user => dispatch => userApi.signin(user)
    .then(res => res.json())
    .then(user => {
        if (user.data) {
            if (user.data) {
                localStorage.setItem('jwt', JSON.stringify({
                    'token': user.data.token,
                    'userId': user.data.userId,
                    'loan': user.data.loan,
                    'status': user.data.status,
                    'username': user.data.username,
                    'firstName': user.data.firstName,
                    'secondName': user.data.secondName,
                    'email': user.data.email,
                    'admin': user.data.admin
                }))
                return dispatch(signInUserSuccess(user))
            }
        }
        return dispatch(receiveErrors(user));
    })
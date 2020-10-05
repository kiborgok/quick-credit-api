import * as types from '../actions/actionTypes';
import initialState from './initialState';

const userReducer = (state = initialState.users, action) => {
    switch (action.type) {
        case types.LOAD_USERS_SUCCESS:
            return action.users
        case types.LOAD_USER_SUCCESS:
            return [
                ...state, {
                    ...state,
                    ...action.user
                }
            ]
        case types.SIGN_UP_USER_SUCCESS:
            return action.user
        case types.VERIFY_USER_SUCCESS:
            return state.map(user => {
                if (user._id === action.user.id) {
                    return {
                        ...user,
                        status: action.user.status
                    }
                }
                return user;
            });
        default:
            return state;
    }
}

export default userReducer;
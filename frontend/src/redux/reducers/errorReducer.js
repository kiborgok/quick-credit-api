import * as types from '../actions/actionTypes';
import initialState from './initialState';

const errorReducer = (state = initialState.errors, action) => {
    switch (action.type) {
        case types.RECEIVE_ERRORS:
            return action.error
        case types.CLEAR_ERRORS:
        case types.LOAD_REPAYMENT_HISTORY:
        case types.SIGN_UP_USER_SUCCESS:
        case types.SIGN_IN_USER_SUCCESS:
        case types.CREATE_LOAN:
        case types.REPAY_LOAN:
        case types.LOAD_USERS_SUCCESS:
        case types.LOAD_USER_SUCCESS:
        case types.VERIFY_USER_SUCCESS:
        case types.LOAD_LOANS_SUCCESS:
        case types.LOAD_LOAN_SUCCESS:
        case types.APPROVE_OR_REJECT_LOAN:
            return ''
        default:
            return state;
    }
}

export default errorReducer;
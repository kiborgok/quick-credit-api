import * as types from '../actions/actionTypes';
import initialState from './initialState';

const loanReducer = (state = initialState.loan, action) => {
    switch (action.type) {
        case types.LOAD_LOAN_SUCCESS:
            return action.loan;
        default:
            return state;
    }
}

export default loanReducer;
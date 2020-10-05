import * as types from '../actions/actionTypes';
import initialState from './initialState';

const loanHistoryReducer = (state = initialState.loanHistory, action) => {
    switch (action.type) {
        case types.LOAD_REPAYMENT_HISTORY:
            return action.loanHistory
        default:
            return state;
    }
}

export default loanHistoryReducer;
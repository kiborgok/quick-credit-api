import * as types from '../actions/actionTypes';
import initialState from './initialState';

const loanReducer = (state = initialState.loans, action) => {
    switch (action.type) {
        case types.CREATE_LOAN:
            return action.loan;
        case types.REPAY_LOAN:
            return action.loan;
        case types.LOAD_LOANS_SUCCESS:
            return action.loans;
        case types.APPROVE_OR_REJECT_LOAN:
            return state.map((loan) => {
                if (loan._id === action.loan.loanId) {
                    return {
                        ...loan,
                        status: action.loan.status,
                    };
                }
                return loan;
            });
        default:
            return state;
    }
}

export default loanReducer;
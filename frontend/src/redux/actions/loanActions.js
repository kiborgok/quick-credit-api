import * as loanApi from '../../api/loanApi';
import * as types from './actionTypes';

export const receiveErrors = error => (
    { type: types.RECEIVE_ERRORS, error: error.error }
);

export const createLoan = loan => (
    { type: types.CREATE_LOAN, loan: loan.data }
);

export const repayLoanSuccess = loan => (
    { type: types.REPAY_LOAN, loan: loan.data }
);

export const loadLoansSuccess = loans => (
    { type: types.LOAD_LOANS_SUCCESS, loans: loans.data }
);

export const loadLoanSuccess = (loan) => ({
  type: types.LOAD_LOAN_SUCCESS,
  loan: loan.data,
});

export const loadLoanHistorySuccess = loanHistory => (
    { type: types.LOAD_REPAYMENT_HISTORY, loanHistory: loanHistory.data }
);

export const approveOrReject = loan => (
    { type: types.APPROVE_OR_REJECT_LOAN, loan: loan.data }
);

export function applyLoan(loan) {
    return function (dispatch) {
        return loanApi.applyLoan(loan)
            .then(loan => {
                if (loan.data) {
                    alert(`Loan application is successful. Pending approval.`)
                    return dispatch(createLoan(loan))
                }
                return dispatch(receiveErrors(loan))
            })
    };
};

export function repayLoan(loan) {
    return function (dispatch) {
        return loanApi.repayLoan(loan)
            .then(loan => {
                if (loan.data) {
                    alert(`You have repaid ksh. ${loan.data.repaymentAmount}`)
                    return dispatch(repayLoanSuccess(loan))
                }
                return dispatch(receiveErrors(loan))
            })
    };
};

export function loadLoans(loans) {
    return function (dispatch) {
        return loanApi.loadLoans(loans)
            .then(loans => {
                if (loans.data) return dispatch(loadLoansSuccess(loans))
                return dispatch(receiveErrors(loans))
            })
    };
};

export function loadLoan(loan) {
    return function (dispatch) {
        return loanApi.loadLoan(loan)
            .then(loan => {
                if (loan.data) {
                    return dispatch(loadLoanSuccess(loan))
                }
                return dispatch(receiveErrors(loan))
            })
    };
};

export function loadHistory(loan) {
    return function (dispatch) {
        return loanApi.loadRepaymentHistory(loan)
            .then(loanHistory => {
                if (loanHistory.data) return dispatch(loadLoanHistorySuccess(loanHistory))
                return dispatch(receiveErrors(loanHistory))
            })
    };
};

export function approveOrRejectLoan(loan) {
    return function (dispatch) {
        return loanApi.approveOrRejectLoan(loan)
            .then(loan => {
                if (loan.data) return dispatch(approveOrReject(loan))
                return dispatch(receiveErrors(loan))
            })
    };
};
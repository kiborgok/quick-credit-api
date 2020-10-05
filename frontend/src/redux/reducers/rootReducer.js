import {
    combineReducers
} from 'redux';
import users from './userReducer';
import loan from './myLoanReducer';
import loans from './loanReducer';
import errors from './errorReducer';
import history from './loanHistoryReducer';

const rootReducer = combineReducers({
    users,
    loan,
    loans,
    history,
    errors
});

export default rootReducer;
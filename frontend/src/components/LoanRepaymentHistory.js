import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as loanActions from '../redux/actions/loanActions';

const mapStateToProps = ({ errors, history }) => ({ errors, history });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(loanActions, dispatch)
});

const LoanRepaymentHistory = ({ actions, errors, history }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'))
  const [showError, setShowError] = useState(false);
    useEffect(() => {
      history.length === 0 &&
        actions.loadHistory({ loanId: auth.loan[0]._id, token: auth.token });
    });

  useEffect(() => setShowError(false), []);

  return (
    <>
      <div className="form-signin">
        <h1 className="h3 mb-3 font-weight-normal">Repayment History</h1>
        {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
        {history.length === 0 ? 'You have no loan repayment history' : (
          <>
            {history.map((history) => (
              <div
                key={history._id}>
                <div className="card text-white bg-dark mb-2" style={{ maxWidth: "25rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">Repayment Amount:</h5>
                      <p className="card-text">{"ksh. " + history.repaymentAmount}</p>
                        <h5 className="card-title">Date:</h5>
                      <p className="card-text">{history.createdAt}</p>
                      <h5 className="card-title">Loan Balance:</h5>
                      <p className="card-text">{"ksh. " + history.loanBalance}</p>
                  </div>  
                </div>
              </div>
            ))}</>)}
      </div>
    </>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoanRepaymentHistory));
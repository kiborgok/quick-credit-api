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
      <div className="data-form" style={{ width: "57%" }}>
        <header>
          <h1>Repayment History</h1>
        </header>
        <div className='error'>{showError && errors}</div>
        {history.length === 0 ? 'You have no loan repayment history' : (
          <>
            {history.map((history) => (
              <div
                key={history._id}
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
                <p>
                  <em style={{ fontWeight: "bold" }}>Repayment Amount:</em>{" "}
                  {"ksh. " + history.repaymentAmount}
                </p>
                <p>
                  <em style={{ fontWeight: "bold" }}>Date:</em>{" "}
                  {history.createdAt}
                </p>
                <p>
                  <em style={{ fontWeight: "bold" }}>Loan Balance:</em>{" "}
                  {"ksh. " + history.loanBalance}
                </p>
              </div>
            ))}</>)}
      </div>
    </>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoanRepaymentHistory));
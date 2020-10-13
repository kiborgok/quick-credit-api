import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loanActions from "../redux/actions/loanActions";

const mapStateToProps = ({ errors, loan }) => ({ errors, loan });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(loanActions, dispatch),
});

const LoanDetails = ({ actions, loan, errors }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'))
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    actions.loadLoan({ userId: auth.userId, token: auth.token });
  });
  useEffect(() => setShowError(false), [])
  return (
    <>
      <div className="form-signin">
        <h1 className="h3 mb-3 font-weight-normal">Loan Details</h1>
        {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
        {loan.length === 0 ? 'Checking...' :
          (
            <>
              {loan.map(loan => (
                <div
                  key={loan._id}>
                  <div className="card text-white bg-dark mb-2" style={{ maxWidth: "25rem"}}>
  <div className="card-body">
    <h5 className="card-title">Amount:</h5>
                      <p className="card-text">{"ksh. " + loan.amount}</p>
                        <h5 className="card-title">Inerest:</h5>
                      <p className="card-text">{"ksh. " + loan.interest}</p>
                      <h5 className="card-title">Balance:</h5>
                      <p className="card-text">{"ksh. " + loan.balance}</p>
                      <h5 className="card-title">Period(Months):</h5>
                      <p className="card-text">{loan.tenor}</p>
                      <h5 className="card-title">Paid:</h5>
                      <p className="card-text">{loan.repaid === false ? "Not paid" : "Paid"}</p>
                      <h5 className="card-title">Created At:</h5>
                      <p className="card-text">{loan.createdAt}</p>
                                        <span className={
                    loan.status === "Pending"
                      ? "badge badge-pill badge-warning p-3"
                      : loan.status === "Approved"
                        ? "badge badge-pill badge-success p-3"
                        : "badge badge-pill badge-danger p-3"
                  }>{loan.status}</span>
  </div>
</div>

                </div>
              ))}
            </>
          )
        }
      </div>
    </>
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoanDetails)
);    
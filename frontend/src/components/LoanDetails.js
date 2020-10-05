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
      <div className="data-form" style={{ width: "57%" }}>
        <header>
          <h1>Loan Details</h1>
        </header>
        <div className='error'>{showError && errors}</div>
        {loan.length === 0 ? 'You have no loan' :
          (
            <>
              {loan.map(loan => (
                <div
                  key={loan._id}
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    flexDirection: "column",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0px 2px 10px 0px #185a9d",
                  }}
                >
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Amount: </em>{" "}
                    {"ksh. " + loan.amount}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Interest:</em>{" "}
                    {"ksh. " + loan.interest}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Balance:</em>{" "}
                    {"ksh. " + loan.balance}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Period(Months):</em> {loan.tenor}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Paid:</em>{" "}
                    {loan.repaid === false ? "Not paid" : "Paid"}
                  </p>
                  <p style={{ padding: "5px" }}>
                    <em style={{ fontWeight: "bold" }}>Created At:</em> {loan.createdAt}
                  </p>
                  <button style={{ marginLeft: '30px' }} className={
                    loan.status === "Pending"
                      ? "pending"
                      : loan.status === "Approved"
                        ? "approved"
                        : "unverified"
                  }>{loan.status}</button>
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
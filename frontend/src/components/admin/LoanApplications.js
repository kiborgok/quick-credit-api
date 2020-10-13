import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as loanActions from '../../redux/actions/loanActions';

const mapStateToProps = ({ errors, loans }) => ({
  errors, loans
});

const mapDispatchToProps = dispatch => ({
  actions: {
    loadLoans: bindActionCreators(loanActions.loadLoans, dispatch),
    approveOrRejectLoan: bindActionCreators(loanActions.approveOrRejectLoan, dispatch)
  }
});

const Modal = ({ handleClose, show, loan }) => (
  <div className={show ? 'modal display-block' : 'modal display-none'}>
    <section className='modal-main'>
      <h2>Loan Details</h2>
      <div>
        <h2>Amount: {loan.amount}</h2>
        <h2>Tenor: {loan.tenor}</h2>
        <h2>Interest: {loan.interest}</h2>
        <h2>monthlyInstallment: {loan.monthlyInstallment}</h2>
        <h2>Balance: {loan.balance}</h2>
        <h2>Repaid: {loan.repaid === true ? 'True' : 'False'}</h2>
        <h2>Status: {loan.status}</h2>
      </div>
      <div
        style={{
          position: 'fixed', right: '0', top: '0', color: 'red', fontWeight: 'bold', fontSize: '1.5em', marginRight: '15px', marginTop: '15px'
        }}
        onClick={handleClose}>
        X
            </div>
    </section>
  </div>
)

const LoanApplications = ({ errors, loans, actions }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'))
  const [show, setShow] = useState(false);
  const [loanDetails, setLoanDetails] = useState({
    amount: null,
    tenor: null,
    repaid: null,
    balance: null,
    interest: null,
    status: null,
    monthlyInstallment: null
  });
  const showModal = () => setShow(true)
  const hideModal = () => setShow(false)
  useEffect(() => {
    (loans.length === 0) && actions.loadLoans({ token: auth.token })
  });
  return (
    <>
      <div>
<h1 className="h3 mb-3 font-weight-normal">Loan Applications</h1>
        {errors ? <div className="alert alert-danger" role="alert">{errors}</div> : null}
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Second Name</th>
               <th scope="col">Email</th>
              <th scope="col">Amount</th>
              <th scope="col">Period In Months</th>
              <th scope="col">Balance</th>
              <th scope="col">Status</th>
              <th scope="col">View Loan</th>
            </tr>
          </thead>
          {loans.length !== 0 ? (
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td>{loan.user.firstName}</td>
                  <td>{loan.user.secondName}</td>
                  <td>{loan.user.email}</td>
                  <td>{loan.amount}</td>
                  <td>{loan.tenor}</td>
                  <td>{loan.balance}</td>
                  <td>
                    <span
                      onClick={() => {
                        loan.status === "Rejected"
                          ? actions.approveOrRejectLoan({
                            status: "Approved",
                            loanId: loan._id,
                            token: auth.token
                          })
                          : actions.approveOrRejectLoan({
                            status: "Rejected",
                            loanId: loan._id,
                            token: auth.token
                          });
                      }}
                      className={
                        loan.status === "Pending"
                          ? 'badge badge-pill badge-warning p-3'
                          : loan.status === "Approved"
                            ? 'badge badge-pill badge-success p-3'
                            : 'badge badge-pill badge-danger p-3'
                      }
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    <Modal
                      show={show}
                      loan={loanDetails}
                      handleClose={hideModal}
                    />
                    < span className = "badge badge-pill badge-info p-2"
                      onClick={() => {
                        setLoanDetails({
                          amount: loan.amount,
                          tenor: loan.tenor,
                          repaid: loan.repaid,
                          balance: loan.balance,
                          interest: loan.interest,
                          status: loan.status,
                          monthlyInstallment: loan.paymentInstallment,
                        });
                        showModal();
                      }}
                    >
                      View
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>) : (

              <caption>There are no loans yet</caption>
            )}
        </table>
      </div>
    </>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoanApplications));
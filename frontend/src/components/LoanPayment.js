import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as loanActions from '../redux/actions/loanActions';

const mapStateToProps = ({ errors }) => ({ errors });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(loanActions, dispatch)
});

const LoanPayment = ({ actions, errors, history }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'))
  const [showError, setShowError] = useState(false);
  const [amount, setAmount] = useState(50);

  const handleChange = e => {
    setAmount(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault()
    const pay = async () => {
      const payment = await actions.repayLoan({
        repaymentAmount: amount,
        loanId: auth.loan[0]._id,
        token: auth.token
      })
      if (payment.loan) {
        history.push('/loanRepaymentHistory')
        return window.location.reload();
      }
      setShowError(true)
    }
    pay();
  }
  return (
           <form className="form-signin" onSubmit={handleSubmit} noValidate>
      <h1 className="h3 mb-3 font-weight-normal">Repay loan</h1>
      {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
         <label htmlFor="inputAmount" className="sr-only">Amount</label>
      <input
        className="form-control"
              type="number"
              min="50"
              max="55000"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleChange}
            />
            <output>{"ksh. " + amount}</output>
      <button className="btn btn-lg btn-primary btn-block" type="submit">Repay</button>
      </form>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoanPayment));
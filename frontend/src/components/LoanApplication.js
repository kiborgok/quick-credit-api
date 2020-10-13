import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loanActions from '../redux/actions/loanActions';


const mapStateToProps = ({ errors }) => ({
  errors
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(loanActions, dispatch)
});

const Loan = ({ errors, actions }) => {
  const auth = JSON.parse(localStorage.getItem('jwt'));
  const initialState = { amount: 500, tenor: 1 };
  const [loan, setLoan] = useState(initialState);
  const [showError, setShowError] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setLoan({ ...loan, [name]: value });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const loanObject = {
      amount: loan.amount,
      tenor: loan.tenor,
      userId: auth.userId,
      token: auth.token

    }

    const apply = async () => {
      const application = await actions.applyLoan(loanObject);
      if (application.loan) {
        return window.location.reload();
      }
      setShowError(true)
    }
    apply();

  }
  return (
        <form className="form-signin" onSubmit={handleSubmit} noValidate>
      <h1 className="h3 mb-3 font-weight-normal">Apply for a loan</h1>
      {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
      <label htmlFor="inputAmount" className="sr-only">Amount</label>
      <input type="range"
        className="form-control-range"
        id = "formControlRange"
        name="amount" min="500"
              max="50000"
              step="500"
              value={loan.amount}
              onChange={handleChange} placeholder="Amount" />
            <output>{"ksh. " + loan.amount}</output>
            <label htmlFor="inputTenor" className="sr-only">Period In Months</label>
      <select
        className="form-control mb-2"
              as="select"
              id="tenor"
              name="tenor"
              value={loan.tenor}
        onChange={handleChange}
        placeholder = "Period In Months"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Apply</button>
        </form>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Loan));
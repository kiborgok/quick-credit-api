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
    <>
      <div className="loan-form">
        <header>
          <h1>Apply for a loan</h1>
        </header>
        <div className='error'>{showError && errors}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="amount">Amount</label>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              id="amount"
              name="amount"
              value={loan.amount}
              onChange={handleChange}
            />
            <output>{"ksh. " + loan.amount}</output>
          </div>
          <div className="form-row">
            <label htmlFor="tenor">Period In Months</label>
            <select
              as="select"
              id="tenor"
              name="tenor"
              value={loan.tenor}
              onChange={handleChange}
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
          <div className="form-row">
            <button>Request</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Loan));
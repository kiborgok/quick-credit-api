import React from 'react';
import { Switch, Route, NavLink, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { withRouter } from 'react-router-dom';
import AuthRoute from './auth/AuthRoute'
import ProtectedRoute from './auth/ProtectedRoute'
import Dashboard from './components/Dashboard'
import Signup from './components/Signup';
import Login from './components/Login';
import Loan from './components/LoanApplication';
import Profile from './components/Profile';
import LoanPayment from './components/LoanPayment'
import LoanRepaymentHistory from './components/LoanRepaymentHistory';
import LoanApplications from './components/admin/LoanApplications';
import Clients from './components/admin/Clients';
import LoanDetails from './components/LoanDetails';
import {
  IoMdPersonAdd,
  IoMdLogIn,
  IoMdHome,
  IoMdWallet,
  IoMdCash,
  IoIosLogOut
} from "react-icons/io";

function App({ history }) {
  let authenticated = JSON.parse(localStorage.getItem('jwt'));

  const logout = () => {
    localStorage.removeItem('jwt')
    history.push('/login')
  }
  return (
    <Router>
      <>
        <div className="App">
          <div className="menu-container">
            <div className="menu">
              <div className="logo">Quick Credit</div>
              <div className="links">
                <div className="nav-links login">
                  <NavLink to={"/dashboard"}>
                    <IoMdHome size={24} />
                    Home
                  </NavLink>
                </div>
                {authenticated
                  ? authenticated.admin === "User" &&
                    authenticated.status === "Verified" && (
                      <div className="nav-links login">
                        <NavLink to={"/loanApplication"}>
                        <IoMdCash size={24} /> Loan Application
                        </NavLink>
                      </div>
                    )
                  : null}
                {authenticated
                  ? authenticated.loan[0]
                    ? authenticated.loan[0].status === "Approved" && (
                        <div className="nav-links login">
                        <NavLink to={"/loanPayment"}><IoMdWallet size={24} /> Loan Payment</NavLink>
                        </div>
                      )
                    : null
                  : null}
                {authenticated ? null : (
                  <div className="nav-links login">
                    <NavLink to={"/signup"} className="signup login">
                      <IoMdPersonAdd size={24} /> SignUp
                    </NavLink>
                  </div>
                )}
                {authenticated
                  ? authenticated.admin === "Admin" && (
                      <>
                        <div className="nav-links login">
                          <NavLink to={"/clients"}>Clients</NavLink>
                        </div>
                        <div className="nav-links login">
                          <NavLink to={"/loanApplications"}>
                          Loan Applications
                          </NavLink>
                        </div>
                      </>
                    )
                  : null}
                {authenticated ? (
                  authenticated.admin === "User" ? (
                    <li
                      className="dropdown nav-links"
                      style={{
                        paddingLeft: "10px",
                        backgroundImage: "none",
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span>Account &#9662;</span>
                      <ul className="features-menu">
                        <li>
                          <NavLink to={"/profile"}>Profile</NavLink>
                        </li>
                        <li>
                          <NavLink to={"/loanDetails"}>Loans</NavLink>
                        </li>
                        {authenticated
                          ? authenticated.loan[0] &&
                            authenticated.admin === "User"
                            ? authenticated.loan[0].status === "Approved" && (
                                <li>
                                  <NavLink to={"/loanRepaymentHistory"}>
                                    History
                                  </NavLink>
                                </li>
                              )
                            : null
                          : null}
                        <li
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={logout}
                        >
                          <IoIosLogOut size={24} />
                          LogOut
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        backgroundImage: "none",
                      }}
                      className="nav-links login"
                      onClick={logout}
                    >
                      <IoIosLogOut size={24} />
                      LogOut
                    </div>
                  )
                ) : (
                  <>
                    <div className="nav-links login">
                      <NavLink to={"/login"}>
                        <IoMdLogIn size={24} />
                        SignIn
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid-container">
            <Switch>
              <Route path={["/dashboard", "/"]} exact component={Dashboard} />
              <AuthRoute path="/signup" component={Signup} />
              <AuthRoute path="/login" component={Login} />
              <ProtectedRoute path="/loanApplication" component={Loan} />
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/loanDetails" component={LoanDetails} />
              <ProtectedRoute path="/loanPayment" component={LoanPayment} />
              <ProtectedRoute
                path="/loanRepaymentHistory"
                component={LoanRepaymentHistory}
              />
              <ProtectedRoute path="/clients" component={Clients} />
              <ProtectedRoute
                path="/loanApplications"
                component={LoanApplications}
              />
            </Switch>
          </div>
        </div>
      </>
    </Router>
  );
}

export default withRouter(App);
import React from 'react';
import { Switch, Route, NavLink, BrowserRouter as Router } from 'react-router-dom';
//import './App.css';
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
  IoMdWallet,
  IoMdCash,
  IoMdHome,
  IoIosLogOut,
  IoMdPerson,
  IoIosPeople,
  IoMdList
} from "react-icons/io";

function App({ history }) {
    const authenticated = JSON.parse(localStorage.getItem('jwt'));
  
  const logout = () => {
    localStorage.removeItem('jwt')
    history.push('/login')
  }
  return (
    <Router>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <NavLink className="navbar-brand" to={"/"}>Quick Credit</NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item">
            <NavLink className="nav-link" to={"/dashboard"}><IoMdHome size={24} />Home <span className="sr-only">(current)</span></NavLink>
          </li>
          {authenticated
                  ? authenticated.admin === "User" &&
                    authenticated.status === "Verified" && (
                      <li className="nav-item">
                        <NavLink className="nav-link" to={"/loanApplication"}>
                        <IoMdCash size={24} /> Loan Application
                        </NavLink>
                      </li>
                    )
                  : null}
                {authenticated
                  ? authenticated.loan[0]
                    ? authenticated.loan[0].status === "Approved" && (
                        <li className="nav-item">
                        <NavLink className="nav-link" to={"/loanPayment"}><IoMdWallet size={21} /> Loan Payment</NavLink>
                        </li>
                      )
                    : null
                  : null}
            {authenticated ? null : (
              <>
                  <li className="nav-item">
                <NavLink className="nav-link" to={"/signup"}>
                      SignUp
                    </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/login"}>
                      SignIn
                    </NavLink>
                </li>
                </>
                )}
                {authenticated
                  ? authenticated.admin === "Admin" && (
                      <>
                        <li className="nav-item">
                    <NavLink className="nav-link" to={"/clients"}><IoIosPeople size={24} /> Clients</NavLink>
                        </li>
                        <li className="nav-item"> 
                          <NavLink className="nav-link" to={"/loanApplications"}>
                      <IoMdList size={23}/>Loan Applications
                          </NavLink>
                        </li>
                      </>
                    )
              : null}
            {
              authenticated ? authenticated.admin === "Admin" ? null :
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><IoMdPerson size={24} />Account</a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                  <NavLink className="dropdown-item" to={"/profile"}>Profile</NavLink>
                  <NavLink className="dropdown-item" to={"/loanDetails"}>Loans</NavLink>
                  {authenticated
                    ? authenticated.loan[0] &&
                      authenticated.admin === "User"
                      ? authenticated.loan[0].status === "Approved" && (
                        <NavLink className="dropdown-item" to={"/loanRepaymentHistory"}>
                          History
                                  </NavLink>
                      )
                      : null
                    : null}
                </div>
                </li>
                : null
            }
          </ul>
          {
            authenticated ? 
              (
                  <button onClick={logout} className="btn btn-outline-danger my-2 my-sm-0" type="submit"><IoIosLogOut size={24} />LogOut</button>
              ): (
                  null
              )
            
          }
  
      </div>
    </nav>

    <main role="main" className="container">

      <div className="app">
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

    </main>
    </Router>
      );
      }

      export default withRouter(App);
        {/* <div className="container">
          <div className="row">
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
        </div> */}
  

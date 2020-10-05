import React, { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as userActions from '../redux/actions/userActions';

const mapStateToProps = ({ errors }) => ({ errors });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch)
});

const Login = ({ actions, errors, history }) => {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      password: Yup.string()
        .required("Required"),
    }),
    onSubmit: (values) => {
      const user = {
        email: values.email,
        password: values.password,
      };
      const signUser = async () => {
        setLoading(true)
        console.log("Request sent")
        const login = await actions.signin(user);
        setLoading(false)
        console.log(login)
        if (login.user) {
          history.push("/");
          return window.location.reload();
        }
        setShowError(true);
      }
      signUser();
    },
  });
  return (
    <>
      <div className="login-form">
        <header>
          <h1>Sign In</h1>
        </header>
        <div className='error'>{showError && errors}</div>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='error'>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='error'>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="form-row">
            <button type='submit'>{loading ? "Loading..." : "Sign In"}</button>
            <p style={{ padding: "4px", marginLeft: "3px" }}>
              Don't have an account{" "}
              <Link style={{ textDecoration: "none" }} to="/signup">
                Signup
                </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
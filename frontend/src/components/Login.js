import React, { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
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
        <form className="form-signin" onSubmit={formik.handleSubmit} noValidate>
        <h1 className="h3 mb-3 font-weight-normal">Please sign In</h1>
        {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
      <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address" {...formik.getFieldProps("email")} autoFocus />
        {formik.touched.email && formik.errors.email ? (
              <div className="alert alert-danger" role="alert">{formik.errors.email}</div>
            ) : null}
      <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password" {...formik.getFieldProps("password")} />
        {formik.touched.password && formik.errors.password ? (
              <div className="alert alert-danger" role="alert">{formik.errors.password}</div>
            ) : null}
      <button className="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
     
    </form>
  
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../redux/actions/userActions';

const mapStateToProps = ({ errors }) => ({ errors });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(userActions, dispatch) }
);

const Signup = ({ errors, actions, history }) => {
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      secondName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      username: Yup.string()
        .min(2, "Must be 2 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string()
        .email('Invalid email address')
        .required("Required"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
          `Must be 6-16 characters, one capital letter, one lowercase letter, one digit and one special character`
        )
        .required("Required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      const user = {
        firstName: values.firstName,
        secondName: values.secondName,
        username: values.username,
        email: values.email,
        password: values.password,
      };
      const signUser = async () => {
        const signUp = await actions.signup(user);
        if (signUp.user) {
          return history.push("/login");
        }
        setShowError(true);
      };
      signUser();
    },
  });

  return (
    <div className="signup-form">
      <header>
        <h1>Sign Up</h1>
      </header>
      <div className='error'>{showError && errors}</div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-row">
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            type="text"
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className='error'>{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div className="form-row">
          <label htmlFor="secondName">Second Name</label>
          <input
            name="secondName"
            type="text"
            {...formik.getFieldProps("secondName")}
          />
          {formik.touched.secondName && formik.errors.secondName ? (
            <div className='error'>{formik.errors.secondName}</div>
          ) : null}
        </div>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className='error'>{formik.errors.username}</div>
          ) : null}
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input name="email" type="email" {...formik.getFieldProps("email")} />
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
          <label htmlFor="passwordConfirmation">Password-Confirmation</label>
          <input
            name="passwordConfirmation"
            type="password"
            {...formik.getFieldProps("passwordConfirmation")}
          />
          {formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation ? (
              <div className='error'>{formik.errors.passwordConfirmation}</div>
            ) : null}
        </div>
        <div className="form-row">
          <button type='submit'>
            Sign Up
          </button>
          <p style={{ padding: "4px", marginLeft: "3px" }}>
            Already have an account{" "}
            <Link style={{ textDecoration: "none" }} to="/login">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
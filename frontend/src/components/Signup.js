import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
    <form className="form-signin" onSubmit={formik.handleSubmit} noValidate>
        <h1 className="h3 mb-3 font-weight-normal">Please sign Up</h1>
        {showError && errors ? <div className="alert alert-danger" role="alert">{showError && errors}</div> : null}
        
           <label htmlFor="firstName" className="sr-only">First Name</label>
          <input type="text" name="firstName" id="inputFirstName" className="form-control" placeholder="First Name" {...formik.getFieldProps("firstName")} autoFocus />
        {formik.touched.firstName && formik.errors.firstName ? (
              <div className="alert alert-danger" role="alert">{formik.errors.firstName}</div>
            ) : null}
           <label htmlFor="secondName" className="sr-only">First Name</label>
          <input type="text" name="secondName" id="inputSecondName" className="form-control" placeholder="Second Name" {...formik.getFieldProps("secondName")} />
          {formik.touched.secondName && formik.errors.secondName ? (
            <div className="alert alert-danger" role="alert">{formik.errors.secondName}</div>
          ) : null}
           <label htmlFor="username" className="sr-only">First Name</label>
          <input type="text" name="username" id="inputUsername" className="form-control" placeholder="Username" {...formik.getFieldProps("username")} />
          {formik.touched.username && formik.errors.username ? (
            <div className="alert alert-danger" role="alert">{formik.errors.username}</div>
          ) : null}
 <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address" {...formik.getFieldProps("email")}/>
        {formik.touched.email && formik.errors.email ? (
              <div className="alert alert-danger" role="alert">{formik.errors.email}</div>
            ) : null}
<label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password" {...formik.getFieldProps("password")} />
        {formik.touched.password && formik.errors.password ? (
              <div className="alert alert-danger" role="alert">{formik.errors.password}</div>
            ) : null}
        <label htmlFor="inputPasswordConfirmation" className="sr-only">Password_Confirmation</label>
        <input type="password" name="passwordConfirmation" id="inputPasswordConfirmation" className="form-control" placeholder="Password Confirmation" {...formik.getFieldProps("passwordConfirmation")} />
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
              <div className="alert alert-danger" role="alert">{formik.errors.passwordConfirmation}</div>
            ) : null}
       <button className="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
      </form>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
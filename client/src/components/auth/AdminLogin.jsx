import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { adminLogin } from "../../actions/adminAuth";

const AdminLogin = () => {
  const dispatch = useDispatch();

  // Fetch isAuthenticated from current state AdminAuth
  const isAuthenticated = useSelector(
    (state) => state.AdminAuth.isAuthenticated
  );

  // Create state for storing email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Destructure email and password from formData
  const { email, password } = formData;

  // Update formData on onChange event of textbox
  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  // Login request after submiting form
  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  // if already logged in redirect to dashboard
  if (isAuthenticated) {
    return <Redirect to="/admin/academicYear" />;
  }

  // If not authenticated return login page
  return (
    <Fragment>
      <div className="row">
        <div className="col-md"></div>
        <div className="col-md">
          <div className="card my-4 shadow p-2">
            <div className="card-body">
              <p className="card-header h2">Admin Login</p>
              <form
                className="pt-4"
                onSubmit={(e) => {
                  onSubmit(e);
                }}
              >
                <div className="row">
                  <div className="col">
                    {/* Email Component */}
                    <div className="mb-3">
                      <label htmlFor="txtemail" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="txtemail"
                        name="email"
                        aria-describedby="emailHelp"
                        autoComplete="username"
                        onChange={(e) => {
                          onChange(e);
                        }}
                        value={email}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {/* Password Component */}
                    <div className="mb-3">
                      <label htmlFor="txtpassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="txtpassword"
                        name="password"
                        minLength="6"
                        autoComplete="current-password"
                        onChange={(e) => {
                          onChange(e);
                        }}
                        value={password}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-center">
                    <button type="submit" className="btn btn-primary mx-auto">
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md"></div>
      </div>
    </Fragment>
  );
};

export default AdminLogin;

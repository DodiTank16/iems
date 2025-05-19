import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Redirect to login page if user is not authenticated
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.Auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;

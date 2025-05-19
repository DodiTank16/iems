import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// Redirect to login page if user is not authenticated
const PrivateAdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.AdminAuth);
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to="/admin/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateAdminRoute;

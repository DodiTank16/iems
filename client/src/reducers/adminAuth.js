import {
  ADMIN_LOGIN,
  ADMIN_AUTH_ERROR,
  ADMIN_LOADED,
  ADMIN_LOGOUT,
} from "../actions/types";

// Set the initial state
// Set the token which is stored in local storage
// Set the loading as true
// Set the isAuthenticated and user as null
const initalState = {
  token: localStorage.getItem("adminToken"),
  loading: true,
  isAuthenticated: null,
  admin: null,
};

// This method is to set the auth state.
const AdminAuth = (state = initalState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case ADMIN_LOGIN:
      localStorage.setItem("adminToken", payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
        isAuthenticated: true,
      };
    case ADMIN_LOADED:
      return {
        ...state,
        admin: payload,
        loading: false,
        isAuthenticated: true,
      };
    case ADMIN_AUTH_ERROR:
    case ADMIN_LOGOUT:
      localStorage.removeItem("adminToken");
      return {
        token: null,
        admin: null,
        loading: false,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default AdminAuth;

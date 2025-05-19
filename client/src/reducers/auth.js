import {
  AUTH_ERROR,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_LOADED,
} from "../actions/types";

// Set the initial state
// Set the token which is stored in local storage
// Set the loading as true
// Set the isAuthenticated and user as null
const initalState = {
  token: localStorage.getItem("token"),
  loading: true,
  isAuthenticated: null,
  user: null,
};

// This method is to set the auth state.
const Auth = (state = initalState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
        isAuthenticated: true,
      };
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        loading: false,
        isAuthenticated: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        token: null,
        user: null,
        loading: false,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default Auth;

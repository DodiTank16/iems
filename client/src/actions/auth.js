import axios from "axios";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  DELETE_CURRENT,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_LOADED,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Get the user data like name and email by passing the token to header
// Set the user state
export const loadUser = () => async (dispatch) => {
  if (localStorage.getItem("token")) {
    // It will set the auth token to header
    setAuthToken(localStorage.getItem("token"));
  }

  try {
    const res = await axios.get("/api/auth");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    //
    dispatch({ type: AUTH_ERROR });
  }
};

// Get the email and password and logged in the user.
// Set the user state.
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/auth", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

// Clearing the user state
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: DELETE_CURRENT,
  });
};

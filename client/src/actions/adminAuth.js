import axios from "axios";
import { setAlert } from "./alert";
import {
  ADMIN_LOGIN,
  ADMIN_LOADED,
  ADMIN_LOGOUT,
  ADMIN_AUTH_ERROR,
} from "./types";
import setAdminAuthToken from "../utils/setAdminAuth";

// Get the admin data like name and email by passing the token to header
// Set the admin state
export const loadAdmin = () => async (dispatch) => {
  if (localStorage.getItem("adminToken")) {
    // It will set the auth token to header
    setAdminAuthToken(localStorage.getItem("adminToken"));
  }

  try {
    const res = await axios.get("/api/adminAuth");
    dispatch({ type: ADMIN_LOADED, payload: res.data });
  } catch (err) {
    //
    dispatch({ type: ADMIN_AUTH_ERROR });
  }
};

// Get the email and password and logged in the admin.
// Set the admin state.
export const adminLogin = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/adminAuth", body, config);
    dispatch({
      type: ADMIN_LOGIN,
      payload: res.data,
    });
    dispatch(loadAdmin());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ADMIN_AUTH_ERROR,
    });
  }
};

// Clearing the user state
export const adminLogout = () => (dispatch) => {
  dispatch({
    type: ADMIN_LOGOUT,
  });
};

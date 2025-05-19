import axios from "axios";
import { setAlert } from "./alert";
import { USERS_LOADED, USERS_ERROR } from "./types";

// Get the user name and email as parameter
// Add the user
export const addUser = (formData) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { name, email } = formData;
  try {
    const res = await axios.post(
      "/api/users/register",
      { name: name, email: email },
      config
    );
    //
    dispatch(getUsers());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(error.response.data.errors, "danger"));
  }
};

// Get every users
export const getUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/users");
    dispatch({
      type: USERS_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USERS_ERROR,
    });
  }
};

export const deleteUser = (uid) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.delete(`/api/users/${uid}`, config);
    dispatch(getUsers());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

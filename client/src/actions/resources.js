import axios from "axios";
import { setAlert } from "./alert";
import { RESOURCES_LOADED, RESOURCES_ERROR } from "./types";

// Get the degreeId, classes from formData
// Add the classes via API
export const addResources = (degreeId, classes, labs) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      "/api/resources",
      {
        degreeId: degreeId,
        classes: classes,
        labs: labs,
      },
      config
    );

    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(error.response.data.errors, "danger"));
  }
};

// Get all the resouces
export const getResources = ({ degreeId }) => async (dispatch) => {
  try {
    const res = await axios.get("/api/resources/", {
      params: {
        degreeId,
      },
    });
    dispatch({
      type: RESOURCES_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: RESOURCES_ERROR,
      payload: error.errors,
    });
  }
};

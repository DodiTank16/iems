import axios from "axios";
import { setAlert } from "./alert";

// Importing action types
import { INSTITUTES_LOADED, INSTITUTES_ERROR } from "./types";

// Get instituteName and degrees from instituteDegree
// Object with degreeName field is present in degrees array.
export const getInstitutes = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/institute");
    dispatch({
      type: INSTITUTES_LOADED,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: INSTITUTES_ERROR,
      payload: e.errors,
    });
  }
};

// Add instituteName and degrees
export const addInstitutes = (formData, degrees) => async (dispatch) => {
  // Destructure the instituteName and degrees from formData
  const { instituteName } = formData;

  // Create the object to pass in API
  var obj = {
    instituteName: instituteName,
    // Set the degrees according to API
    degrees: degrees.map((degree) => ({
      degreeName: degree,
    })),
  };
  //
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Add the institute and degrees via api
  try {
    const res = await axios.post(`/api/institute`, obj, config);
    //
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getInstitutes());
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const addInstituteName = (instituteName) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Add the institute api
  try {
    const res = await axios.post(
      `/api/institute/name`,
      { instituteName },
      config
    );
    dispatch(getInstitutes());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const deleteInstitute = (instituteId) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //
  // Delete the institute via api
  try {
    const res = await axios.delete(`/api/institute/${instituteId}`, config);
    dispatch(getInstitutes());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const deleteDegree = (instituteName, degreeId) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(degreeId);
  // Delete the institute via api
  try {
    const res = await axios.delete(
      `/api/institute/degree/${instituteName}/${degreeId}`,
      config
    );
    dispatch(getInstitutes());
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const editInstituteName = (newName, id) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Edit the institute
  try {
    await axios.put(`/api/institute/${id}`, { instituteName: newName }, config);
    dispatch(getInstitutes());
    dispatch(setAlert("Institute Name edited", "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

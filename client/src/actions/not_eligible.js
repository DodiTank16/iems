import axios from "axios";
import {
  NOT_ELIGIBLITY_LISTS_LOADED,
  NOT_ELIGIBLITY_LIST_ERROR,
  NOT_ELIGIBLITY_LIST_LOADED,
} from "./types";
import { setAlert } from "./alert";

// Add the not eligible students
export const addNotEligiblityList = ({
  formData,
  academicYearId,
  semester,
}) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Get values from formData
  const { componentName, subjectName, neStudents } = formData;

  // Create object that is sent via api call to server
  var obj = {
    academicYear: academicYearId,
    semester,
    subject: subjectName,
    componentName,
    neStudents: neStudents.map((student) => ({
      studentId: student,
    })),
  };

  // Add the not eligible students via api
  try {
    await axios.post(`/api/not-eligible`, obj, config);
    dispatch(setAlert("Not Eligiblity list saved.", "success"));
  } catch (err) {
    //
    dispatch(setAlert(err.response.data, "danger"));
  }
};

// Get the not eligible students
export const getNotEligiblityList = ({
  academicYear,
  semester,
  subject,
  componentName,
}) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/not-eligible/`, {
      params: {
        academicYear,
        semester,
        subject,
        componentName,
      },
    });
    dispatch({
      type: NOT_ELIGIBLITY_LIST_LOADED,
      payload: res.data,
    });
  } catch (e) {
    //
    dispatch({
      type: NOT_ELIGIBLITY_LIST_ERROR,
    });
  }
};

export const getNotEligiblityLists = ({ academicYear, semester }) => async (
  dispatch
) => {
  try {
    const res = await axios.get(`/api/not-eligible/`, {
      params: {
        academicYear,
        semester,
      },
    });
    dispatch({
      type: NOT_ELIGIBLITY_LISTS_LOADED,
      payload: res.data,
    });
  } catch (e) {
    //
    dispatch({
      type: NOT_ELIGIBLITY_LIST_ERROR,
    });
  }
};

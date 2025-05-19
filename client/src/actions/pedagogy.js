import axios from "axios";
import { setAlert } from "./alert";
import { PEDAGOGIES_LOADED, PEDAGOGY_ERROR, PEDAGOGY_LOADED } from "./types";

// Add the pedagogy by getting the data from formData, semesterno and academic year
export const addPedagogy = (formData, semesterNo, academicYear) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { subjectName, noOfComponents } = formData;

  var components = [];
  for (var i = 0; i < noOfComponents; i++) {
    var name = formData["c" + i + "-Name"];
    var mode = formData["c" + i + "-Mode"];
    var weightAge = formData["c" + i + "-Weightage"];
    components.push({ name, mode, weightAge });
  }
  var obj = {
    subject: subjectName,
    components,
    semester: semesterNo,
    academicYear,
  };
  try {
    const res = await axios.post(`/api/pedagogy`, obj, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    //
    dispatch(setAlert(err.response.data, "danger"));
  }
};

// Get academicYear,semester and compoents according to subjectId
// Object with fields like name, mode and weightage are present in components array
export const getPedagogy = ({ subjectId }) => async (dispatch) => {
  try {
    const res = await axios.get("/api/pedagogy/", {
      params: {
        subjectId,
      },
    });
    dispatch({
      type: PEDAGOGY_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PEDAGOGY_ERROR,
    });
  }
};

// Get subject,semester and compoents according to academic year
// Object with fields like name, mode and weightage are present in components array
export const getPedagogyAY = ({ academicYear }) => async (dispatch) => {
  try {
    const res = await axios.get("/api/pedagogy/", {
      params: {
        academicYear,
      },
    });
    dispatch({
      type: PEDAGOGIES_LOADED,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    //
    dispatch({
      type: PEDAGOGY_ERROR,
    });
  }
};

// Get subject,semester and compoents according to academic year and semester group
// Object with fields like name, mode and weightage are present in components array
export const getPedagogySG = ({ semesterGroup, academicYear }) => async (
  dispatch
) => {
  semesterGroup = semesterGroup ? semesterGroup : "NA";
  try {
    const res = await axios.get("/api/pedagogy/", {
      params: {
        semesterGroup,
        academicYear,
      },
    });
    dispatch({
      type: PEDAGOGIES_LOADED,
      payload: res.data,
    });
    return;
  } catch (err) {
    //
    dispatch({
      type: PEDAGOGY_ERROR,
    });
  }
};

// Get subject and compoents according to academic year and semester
// Object with fields like name, mode and weightage are present in components array
export const getPedagogySN = ({ semesterNo, academicYear }) => async (
  dispatch
) => {
  semesterNo = semesterNo ? semesterNo : 0;
  //
  try {
    const res = await axios.get("/api/pedagogy/", {
      params: {
        semesterNo,
        academicYear,
      },
    });
    dispatch({
      type: PEDAGOGIES_LOADED,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    //
    dispatch({
      type: PEDAGOGY_ERROR,
    });
  }
};

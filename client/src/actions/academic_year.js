import axios from "axios";
import { setAlert } from "./alert";
// Importing action types
import { AY_ERROR, AY_LOADED } from "./types";

// Get Id	Year	DegreeId	SemesterNo	SubjectId	CreatedAt	UpdatedAt	CreatedUserId	ModifiedUserId	RecStatus from academic year
export const getAcademicYear = ({ degreeId }) => async (dispatch) => {
  if (degreeId) {
    try {
      const res = await axios.get(`/api/academic-year/degree/${degreeId}`);
      //
      dispatch({
        type: AY_LOADED,
        payload: res.data,
      });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: AY_ERROR,
      });
    }
  }
};

export const addAcademicYear = (degreeId, ay) => async (dispatch) => {
  const { year, sem } = ay;
  let semesters = [];
  for (var i = 1; i <= sem; i++) {
    semesters.push({
      semesterNo: i,
    });
  }
  //
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // //
  try {
    const res = await axios.post(
      "/api/academic-year/ay",
      { year: year, degreeId: degreeId, semesters: semesters },
      config
    );
    dispatch(getAcademicYear({ degreeId: degreeId }));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

// add subjects to db
// get degreeId, year and array of subjects
export const addAYSubjects = (degreeId, ay, subjects, sem) => async (
  dispatch
) => {
  let obj = [];
  for (var i = 0; i < subjects.length; i++) {
    obj.push({
      subjectId: subjects[i].id,
    });
  }
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // //
  try {
    const res = await axios.post(
      `/api/academic-year/ay/subject/${sem}`,
      { year: ay, degreeId: degreeId, subjects: obj },
      config
    );
    dispatch(getAcademicYear({ degreeId: degreeId }));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const addSemesters = (formData) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { year, degree, semesterNo, subjects } = formData;
  var obj = {
    year: year,
    degreeId: degree,
    semesters: [
      {
        semesterNo: semesterNo,
        subjects: subjects.map((sub) => ({
          subjectId: sub,
        })),
      },
    ],
  };
  //
  try {
    const res = await axios.post("/api/academic-year/", obj, config);
    dispatch(getAcademicYear({ degreeId: degree }));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const updateAcademicYear = (year, id, degree) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Edit the academicyear
  try {
    await axios.put(`/api/academic-year/${id}`, { year: year }, config);
    dispatch(setAlert("Academic Year edited", "success"));
    dispatch(getAcademicYear({ degreeId: degree }));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const deleteAY = (ayid) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Delete the academic year via api
  try {
    const res = await axios.delete(`/api/academic-year/${ayid}`, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    //
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

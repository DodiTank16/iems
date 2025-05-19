import {
  DELETE_CURRENT,
  UPDATE_ACADEMIC_YEAR,
  UPDATE_DEGREE,
  UPDATE_INSTITUTE,
  UPDATE_SEMESTER_GROUP,
  UPDATE_SEMESTER_NUMBER,
} from "./types";

// Update the current state's institute field
export const updateInstitute = (institute) => (dispatch) => {
  dispatch({
    type: UPDATE_INSTITUTE,
    payload: institute,
  });
};

// Update the current state's degree field
export const updateDegree = (degree) => (dispatch) => {
  dispatch({
    type: UPDATE_DEGREE,
    payload: degree,
  });
};

// Update the current state's academic year field
export const updateAcademicYear = (academicYear) => (dispatch) => {
  dispatch({
    type: UPDATE_ACADEMIC_YEAR,
    payload: academicYear,
  });
};

// Update the current state's semester group field

export const updateSemesterGroup = (group) => (dispatch) => {
  dispatch({
    type: UPDATE_SEMESTER_GROUP,
    payload: group,
  });
};

// Update the current state's semester field
export const updateSemesterNo = (semesterNumber) => (dispatch) => {
  dispatch({
    type: UPDATE_SEMESTER_NUMBER,
    payload: semesterNumber,
  });
};

// Clear the whole current state
export const deleteCurrent = () => (dispatch) => {
  dispatch({
    type: DELETE_CURRENT,
  });
};

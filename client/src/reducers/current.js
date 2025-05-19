const {
  UPDATE_SEMESTER_NUMBER,
  UPDATE_ACADEMIC_YEAR,
  UPDATE_DEGREE,
  UPDATE_INSTITUTE,
  DELETE_CURRENT,
  UPDATE_SEMESTER_GROUP,
} = require("../actions/types");

// Set the initialState
// Set the institute, degree, academicYear, semesterGroup, semesterNo as null in state

const initalState = {
  institute: null,
  degree: null,
  academicYear: null,
  semesterGroup: null,
  semesterNo: null,
};

// This method is to set the current state.
const CurrentState = (state = initalState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case UPDATE_INSTITUTE:
      return {
        ...state,
        institute: payload,
      };
    case UPDATE_DEGREE:
      return {
        ...state,
        degree: payload,
      };
    case UPDATE_ACADEMIC_YEAR:
      return {
        ...state,
        academicYear: payload,
      };

    case UPDATE_SEMESTER_GROUP:
      return {
        ...state,
        semesterGroup: payload,
      };
    case UPDATE_SEMESTER_NUMBER:
      return {
        ...state,
        semesterNo: payload,
      };
    case DELETE_CURRENT:
      return {
        institute: null,
        degree: null,
        academicYear: null,
        semesterGroup: null,
        semsterNo: null,
      };
    default:
      return state;
  }
};

export default CurrentState;

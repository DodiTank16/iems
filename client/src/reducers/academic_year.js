import { AY_LOADED, AY_ERROR } from "../actions/types";

// Set the initialState with an empty array.
const initialState = {
  academicYears: [],
};

// This method is to set the state.
const AcademicYear = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case AY_LOADED:
      return {
        ...state,
        academicYears: payload,
      };
    case AY_ERROR:
      return {
        academicYears: [],
      };
    default:
      return state;
  }
};

export default AcademicYear;

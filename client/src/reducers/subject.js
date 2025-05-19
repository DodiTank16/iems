import { SUBJECTS_ERROR, SUBJECTS_LOADED } from "../actions/types";

// Set the initalState
// Set the institutes array as empty
// Set the loading as true
// Set the error object as null
const initialState = {
  subjects: [],
  loading: true,
  error: {},
};

// This method is to set the subject state.
const Subject = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case SUBJECTS_LOADED:
      return {
        ...state,
        subjects: payload,
        loading: false,
      };
    case SUBJECTS_ERROR:
      return {
        ...state,
        subjects: [],
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Subject;

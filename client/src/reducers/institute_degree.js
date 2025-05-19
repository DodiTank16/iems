import { INSTITUTES_LOADED, INSTITUTES_ERROR } from "../actions/types";

// Set the initalState
// Set the institutes array as empty
// Set the loading as true
// Set the error object as null
const initialState = {
  institutes: [],
  loading: true,
  error: {},
};

// This method is to set the instituteDegree state.
const InstituteDegree = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case INSTITUTES_LOADED:
      return {
        ...state,
        institutes: payload,
        loading: false,
      };
    case INSTITUTES_ERROR:
      return {
        ...state,
        institutes: [],
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default InstituteDegree;

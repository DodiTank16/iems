import {
  NOT_ELIGIBLITY_LISTS_LOADED,
  NOT_ELIGIBLITY_LIST_ERROR,
  NOT_ELIGIBLITY_LIST_LOADED,
} from '../actions/types';

// Set the initalState
// Set the ne array as empty
const initialState = {
  neList: [],
  neLists: [],
};

// This method is to set the notEligible state.
const NotEligible = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case NOT_ELIGIBLITY_LIST_LOADED:
      return {
        neList: payload,
        neLists: [],
      };
    case NOT_ELIGIBLITY_LISTS_LOADED:
      return {
        neList: [],
        neLists: payload,
      };
    case NOT_ELIGIBLITY_LIST_ERROR:
      return {
        neList: [],
        neLists: [],
      };
    default:
      return state;
  }
};

export default NotEligible;

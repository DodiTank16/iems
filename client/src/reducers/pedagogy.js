import {
  PEDAGOGIES_LOADED,
  PEDAGOGY_ERROR,
  PEDAGOGY_LOADED,
} from "../actions/types";

// Set the initalState
// Set the pedagogy object as null
// Set the pedagogies array as empty
const inistialState = {
  pedagogy: null,
  pedagogies: [],
};

// This method is to set the pedagogy state.
const Pedagogy = (state = inistialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case PEDAGOGY_LOADED:
      return {
        pedagogy: payload,
        pedagogies: [],
      };
    case PEDAGOGIES_LOADED:
      return {
        pedagogy: null,
        pedagogies: payload,
      };
    case PEDAGOGY_ERROR:
      return {
        pedagogy: null,
        pedagogies: [],
      };
    default:
      return state;
  }
};

export default Pedagogy;

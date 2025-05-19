import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// Set the initialState.
const initialState = [];

// This method is to set the alert state.
const Alert = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case SET_ALERT:
      let alerts = [...state, payload];
      return alerts.filter(
        (v, i, a) => a.findIndex((t) => t.msg === v.msg) === i
      );
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export default Alert;

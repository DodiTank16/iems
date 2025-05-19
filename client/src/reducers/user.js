import { USERS_ERROR, USERS_LOADED } from "../actions/types";

const initialState = {
  users: [],
  loading: true,
};

// This method is to set the User state.
const User = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case USERS_LOADED:
      return {
        ...state,
        users: payload,
        loading: false,
      };
    case USERS_ERROR:
      return {
        ...state,
        users: [],
        loading: false,
      };
    default:
      return state;
  }
};

export default User;

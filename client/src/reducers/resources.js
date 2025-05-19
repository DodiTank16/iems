import { RESOURCES_ERROR, RESOURCES_LOADED } from "../actions/types";

const initialState = {
  resources: {},
  loading: true,
};

const Resources = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case RESOURCES_LOADED:
      return {
        ...state,
        resources: payload,
        loading: false,
      };
    case RESOURCES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Resources;

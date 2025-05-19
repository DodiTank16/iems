import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuid } from "uuid";

// Display the alert message according to message type for 4 sec
export const setAlert = (msg, alertType, timeout = 4000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType,
    },
  });
  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, timeout);
};

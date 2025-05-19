import {
  EXAM_SCHEDULES_LOADED,
  EXAM_SCHEDULE_ERROR,
  EXAM_SCHEDULE_LOADED,
} from "../actions/types";

// Set the initialState
// Set the examSchedule as null objects
// Set the examSchedules as empty array
const initialState = {
  examSchedule: null,
  examSchedules: [],
};

// This method is to set the examSchedule state.
const ExamSchedule = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case EXAM_SCHEDULE_LOADED:
      return {
        examSchedule: payload,
        examSchedules: [],
      };
    case EXAM_SCHEDULES_LOADED:
      return {
        examSchedule: null,
        examSchedules: payload,
      };
    case EXAM_SCHEDULE_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default ExamSchedule;

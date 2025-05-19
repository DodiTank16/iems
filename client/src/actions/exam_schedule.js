import axios from "axios";
import {
  EXAM_SCHEDULES_LOADED,
  EXAM_SCHEDULE_ERROR,
  EXAM_SCHEDULE_LOADED,
} from "./types";
import { setAlert } from "./alert";

// Add the exam schedule by getting the formdata, academicyear and semester no
// subjects, testname, examWeekFrom, examWeekTo are present in formData
export const addExamSchedule = (formData, academicYear, semesterNo) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { subjects, testName, examWeekFrom, examWeekTo } = formData;
  var schedule = [];
  // Get all the values from formData and set it in right way according to api
  for (var i = 0; i < subjects.length; i++) {
    var subjectId = subjects[i]._id;
    var from = formData[i + "-from"];
    var to = formData[i + "-to"];
    schedule.push({ subjectId, from, to });
  }
  var obj = {
    academicYear,
    semester: semesterNo,
    schedule,
    testName,
    examWeekFrom,
    examWeekTo,
  };
  try {
    const res = await axios.post(`/api/exam-schedule`, obj, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    //
    dispatch(setAlert(err.response.data, "danger"));
  }
};

// Getting examWeekFrom, examWeekTo, schedule from the exam schedules according to semesterno,academic year and testname
// Object with fields like subjectId, from, to is present in schedule array.
export const getExamScheduleSN = ({
  semesterNo,
  academicYear,
  testName,
}) => async (dispatch) => {
  semesterNo = semesterNo ? semesterNo : 0;
  try {
    const res = await axios.get("/api/exam-schedule/", {
      params: {
        semesterNo,
        academicYear,
        testName,
      },
    });
    dispatch({
      type: EXAM_SCHEDULE_LOADED,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    //
    dispatch({
      type: EXAM_SCHEDULE_ERROR,
    });
  }
};

// Getting examWeekFrom, examWeekTo, schedule from the exam schedules according to semestergroup,academic year and testname
// Object with fields like subjectId, from, to is present in schedule array.
export const getExamScheduleSG = ({
  semesterGroup,
  academicYear,
  testName,
}) => async (dispatch) => {
  semesterGroup = semesterGroup ? semesterGroup : "NA";
  try {
    const res = await axios.get("/api/exam-schedule/", {
      params: {
        semesterGroup,
        academicYear,
        testName,
      },
    });
    dispatch({
      type: EXAM_SCHEDULES_LOADED,
      payload: res.data,
    });
    return;
  } catch (err) {
    //
    dispatch({
      type: EXAM_SCHEDULE_ERROR,
    });
  }
};

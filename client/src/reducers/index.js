import { combineReducers } from "redux";
import Alert from "./alert";
import Auth from "./auth";
import CurrentState from "./current";
import AcademicYear from "./academic_year";
import InstituteDegree from "./institute_degree";
import Pedagogy from "./pedagogy";
import ExamSchedule from "./exam_schedule";
import NotEligible from "./not_eligible";
import AdminAuth from "./adminAuth";
import Subject from "./subject";
import User from "./user";
import Resources from "./resources";

// This is the root/main file of reducer
// This will return the combineRducers.
// Every reducer must return from here.
export default combineReducers({
  Alert,
  Auth,
  CurrentState,
  AcademicYear,
  InstituteDegree,
  Pedagogy,
  ExamSchedule,
  NotEligible,
  AdminAuth,
  Subject,
  User,
  Resources,
});

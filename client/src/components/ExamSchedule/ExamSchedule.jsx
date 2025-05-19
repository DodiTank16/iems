import React, { Fragment, useEffect, useState } from "react";
import DropDown from "../layout/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getPedagogySN } from "../../actions/pedagogy";
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from "../../actions/current";
import { getInstitutes } from "../../actions/institutes_degree";
import { getAcademicYear } from "../../actions/academic_year";
import { oddSems, evenSems } from "../../utils/defaults";
import moment from "moment";
import Component from "./Component";
import {
  addExamSchedule,
  getExamScheduleSN,
} from "../../actions/exam_schedule";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";

const ExamSchedule = () => {
  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Get data from current state using useSelector
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);
  const { pedagogies } = useSelector((state) => state.Pedagogy);
  const { examSchedule } = useSelector((state) => state.ExamSchedule);

  // Fetch from institues if not available
  useEffect(() => {
    if (institute == null) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institute]);

  let initialState = {
    testName: "",
    examWeekFrom: moment().format("yyyy-MM-DD"),
    examWeekTo: moment().add(7, "days").format("yyyy-MM-DD"),
    subjects: [],
  };

  // Creating formData, and expType states using useState
  const [formData, setFormData] = useState(initialState);
  const [expType, setExpType] = useState("");

  // Destructure formData
  const { testName, examWeekFrom, examWeekTo, subjects } = formData;

  // If academicYear, semesterGroup and semesterNo is available fetch pedagogies and for semesterNo
  useEffect(() => {
    if (academicYear && semesterGroup && semesterNo) {
      const AYId = academicYears.filter((ay) => ay.year === academicYear)[0]
        ._id;
      dispatch(getPedagogySN({ semesterNo, academicYear: AYId }));
      dispatch(
        getExamScheduleSN({
          semesterNo,
          academicYear: AYId,
          testName,
        })
      );
    }
    setFormData(initialState);
  }, [dispatch, semesterNo, academicYear, semesterGroup, academicYears]);

  // When testName is changed get corresponding examScheule
  useEffect(() => {
    setFormData((_) => ({
      testName,
      examWeekFrom,
      examWeekTo,
      subjects,
    }));
    testName &&
      dispatch(
        getExamScheduleSN({
          semesterNo,
          academicYear: academicYears.filter(
            (ay) => ay.year === academicYear
          )[0]._id,
          testName,
        })
      );
  }, [testName, dispatch, semesterNo, academicYear, academicYears]);

  // After fetching examSchdule append schedule dates to formData
  useEffect(() => {
    if (examSchedule && subjects) {
      let fd = { ...formData };
      fd.examWeekFrom = examSchedule.examWeekFrom;
      fd.examWeekTo = examSchedule.examWeekTo;
      //
      for (let i = 0; i < subjects.length; i++) {
        for (let index = 0; index < examSchedule.schedule.length; index++) {
          if (subjects[i]._id === examSchedule.schedule[index].subjectId._id) {
            fd[i + "-from"] = examSchedule.schedule[index].from;
            fd[i + "-to"] = examSchedule.schedule[index].to;
          }
        }
      }
      setFormData(fd);
    } else {
      setFormData({
        testName,
        examWeekFrom,
        examWeekTo,
        subjects,
      });
    }
  }, [examSchedule, subjects, testName]);

  // Check if tow exams' timming does not clash
  const validateExamTime = () => {
    for (let i = 0; i < subjects.length; i++) {
      for (let j = i + 1; j < subjects.length; j++) {
        if (formData[`${j}-to`] === formData[`${i}-to`]) {
          dispatch(
            setAlert("Two exams cannot start on the same time", "danger")
          );
          return false;
        }
        if (formData[`${j}-from`] === formData[`${i}-from`]) {
          dispatch(setAlert("Two exams cannot have same time", "danger"));
          return false;
        }
      }
    }
    return true;
  };

  // Return ExamSchdule Component
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        validateExamTime() &&
          dispatch(
            addExamSchedule(
              formData,
              academicYears.filter((ay) => ay.year === academicYear)[0]._id,
              semesterNo
            )
          );
      }}
    >
      <div className="row py-3">
        {/* Card 1: Render dropdowns for institute, degree, academic year, semester Group and semester number */}
        <div className="col-md-3 pb-3 pr-1">
          <div className="card h-100 shadow">
            <div className="card-body">
              <Fragment>
                <DropDown
                  id="ddInstitute"
                  title="Institute"
                  options={institutes.map((inst) => {
                    return inst.instituteName;
                  })}
                  isDisabled={false}
                  value={institute}
                  onChange={(e) => {
                    dispatch(updateInstitute(e.target.value));
                    dispatch(updateDegree(null));
                    dispatch(updateAcademicYear(null));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
                    let drp = document.getElementById("ddDegree");
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id="ddDegree"
                  title="Degree"
                  options={
                    institute
                      ? institutes
                          .filter((inst) => inst.instituteName === institute)[0]
                          .degrees.map((deg) => deg.degreeName)
                          .sort()
                      : []
                  }
                  value={degree}
                  isDisabled={institute ? false : true}
                  onChange={(e) => {
                    dispatch(updateDegree(e.target.value));
                    dispatch(updateAcademicYear(null));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
                    dispatch(
                      getAcademicYear({
                        degreeId: institutes
                          .filter((inst) => inst.instituteName === institute)[0]
                          .degrees.filter(
                            (deg) => deg.degreeName === e.target.value
                          )[0]._id,
                      })
                    );
                    let drp = document.getElementById("ddAcademicYear");
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id="ddAcademicYear"
                  title="Academic Year"
                  options={academicYears.map((ay) => {
                    return ay.year;
                  })}
                  value={academicYear}
                  isDisabled={
                    degree !== null && institute !== null ? false : true
                  }
                  onChange={(e) => {
                    dispatch(updateAcademicYear(e.target.value));
                    dispatch(updateSemesterGroup(null));
                    dispatch(updateSemesterNo(null));
                    let drp = document.getElementById("ddSemesterGroup");
                    drp.disabled = false;
                  }}
                />
                <div className="row">
                  <div className="col-md">
                    <DropDown
                      id="ddSemesterGroup"
                      title="Semester Group"
                      options={["Even", "Odd"]}
                      value={semesterGroup}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        dispatch(updateSemesterGroup(e.target.value));
                        dispatch(updateSemesterNo(null));
                        let drp = document.getElementById("ddSemesterNo");
                        drp.disabled = false;
                      }}
                    />
                  </div>
                  <div className="col-md">
                    <DropDown
                      id="ddSemesterNo"
                      title="Semester No."
                      value={semesterNo}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null &&
                        semesterGroup !== null
                          ? false
                          : true
                      }
                      options={"Even" === semesterGroup ? evenSems : oddSems}
                      onChange={(e) => {
                        dispatch(updateSemesterNo(e.target.value));
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        {/* Card 2: Render dropdowns for componentName and type of export, and textboxes for examWeekFrom and to*/}{" "}
        <div className="col-md-3 pb-3 pr-1">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="text-center">EXAM SCHEDULE</h3>
              <DropDown
                title="Internal-Examination"
                options={["Unit Test 1", "Unit Test 2"]}
                id="ddIE"
                onChange={(e) => {
                  let subjects = [];
                  pedagogies.forEach((pedagogy) => {
                    pedagogy.components.forEach((component) => {
                      if (e.target.value === component["name"]) {
                        subjects.push(pedagogy.subject);
                      }
                    });
                  });
                  setFormData({
                    ...formData,
                    testName: e.target.value,
                    subjects,
                  });
                }}
                isDisabled={semesterNo ? false : true}
                value={testName}
              />
              <p className="h5">Exam-week</p>
              <div className="form-group">
                <label htmlFor="example-date-input">From</label>
                <div>
                  <input
                    className="form-control"
                    type="date"
                    value={examWeekFrom}
                    min={moment().format("yyyy-MM-DD")}
                    name="examWeekFrom"
                    onChange={(e) => {
                      //
                      setFormData({
                        ...formData,
                        examWeekFrom: e.target.value,
                        examWeekTo: moment(e.target.value)
                          .add(7, "days")
                          .format("yyyy-MM-DD"),
                      });
                      //
                    }}
                    disabled={semesterNo ? false : true}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="example-date-input">To</label>
                <div>
                  <input
                    className="form-control"
                    type="date"
                    value={examWeekTo}
                    min={examWeekFrom}
                    name="examWeekTo"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        examWeekTo: e.target.value,
                      });
                    }}
                    disabled={semesterNo ? false : true}
                  />
                </div>
              </div>
              <DropDown
                title="Export Data For"
                id="ddExpData"
                isDisabled={semesterNo ? false : true}
                value={expType}
                onChange={(e) => {
                  setExpType(e.target.value);
                }}
                isRequired={false}
                options={["Unit Test 1", "Unit Test 2"]}
              />
              <Link
                to={"/examSchedule/export-data/" + expType}
                className={expType ? "btn btn-dark" : "btn btn-dark disabled"}
              >
                Export Data
              </Link>
            </div>
          </div>
        </div>
        {/* Card 3: Placeholder for rendering schedules */}
        <div className="col-md-6 pb-3">
          <div className="card h-100 shadow">
            <div className="card-body">
              {subjects.map((subject, index) => (
                <Component
                  index={index}
                  key={index}
                  newSubject={false}
                  subjectName={subject.subjectCode + " " + subject.subjectName}
                  examWeekFrom={examWeekFrom}
                  examWeekTo={examWeekTo}
                  examFrom={formData[index + "-from"]}
                  examTo={formData[index + "-to"]}
                  onFromDateChange={(e) => {
                    setFormData({
                      ...formData,
                      [index + "-from"]: moment(e.target.value).format(
                        "MM-DD-YYYY,HH:mm"
                      ),
                    });
                  }}
                  onToDateChange={(e) => {
                    setFormData({
                      ...formData,
                      [index + "-to"]: moment(e.target.value).format(
                        "MM-DD-YYYY,HH:mm"
                      ),
                    });
                  }}
                />
              ))}
              <input type="submit" className="btn btn-primary" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExamSchedule;

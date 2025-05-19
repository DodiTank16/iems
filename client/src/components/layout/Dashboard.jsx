import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DropDown from "./DropDown";
import { getInstitutes } from "../../actions/institutes_degree";
import { oddSems, evenSems } from "../../utils/defaults";
import { getAcademicYear } from "../../actions/academic_year";

import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from "../../actions/current";

const Dashboard = () => {
  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Get data from current state using useSelector
  const { institutes, loading } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);

  // Get institutes as soon as this component loads
  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  return (
    !loading && (
      <Fragment>
        <div className="row py-3">
          <div className="col-lg-4"></div>
          {/* Card 2: Render dropdowns for subject name, number of components type of export*/}
          <div className="col-lg-4">
            <form>
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
                              .filter(
                                (inst) => inst.instituteName === institute
                              )[0]
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
                              .filter(
                                (inst) => inst.instituteName === institute
                              )[0]
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
                          options={
                            "Even" === semesterGroup ? evenSems : oddSems
                          }
                          onChange={(e) => {
                            dispatch(updateSemesterNo(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                  </Fragment>
                  <br />
                  {semesterNo && (
                    <Fragment>
                      <div className="row">
                        <div className="col-md-7">
                          <Link
                            className="btn btn-outline-info w-100 mb-3"
                            to="/neList"
                          >
                            Not-eligibilty List
                          </Link>
                        </div>
                        <div className="col-md-5">
                          <Link
                            className="btn btn-outline-info w-100 -3 mb-3"
                            to="/pedagogy"
                          >
                            Pedagogy
                          </Link>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <Link
                            className="btn btn-outline-info w-100 mb-3"
                            to="examSchedule"
                          >
                            Exam Schedule
                          </Link>
                        </div>
                        <div className="col-md-7">
                          <Link
                            className="btn btn-outline-info w-100 mb-3"
                            to="seatingArrangement"
                          >
                            Seating Arrangement
                          </Link>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </Fragment>
    )
  );
};

export default Dashboard;

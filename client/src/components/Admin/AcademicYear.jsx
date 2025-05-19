import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAcademicYear,
  addAYSubjects,
  deleteAY,
  getAcademicYear,
  updateAcademicYear,
} from "../../actions/academic_year";
import { setAlert } from "../../actions/alert";
import { getInstitutes } from "../../actions/institutes_degree";
import { getSubjects } from "../../actions/subject";
import SideNavbar from "./SideNavbar";

function AcademicYear() {
  const dispatch = useDispatch();

  // get the academic year data from DB
  const dbAcademicYears = useSelector(
    (state) => state.AcademicYear.academicYears
  );

  // get the insitute degree from db
  const dbInstituteDegree = useSelector(
    (state) => state.InstituteDegree.institutes
  );

  // get the subjects from db
  const dbSubjects = useSelector((state) => state.Subject.subjects);

  // state for list of institutes
  const [institutes, setinstitutes] = useState([]);
  // state for selected institute
  const [institute, setinstitute] = useState("");

  // state for list of degrees
  const [degrees, setdegrees] = useState([]);
  // state for selected degree
  const [degree, setdegree] = useState("");

  // state for get the value of academicyear input field
  const [ay, setay] = useState({
    year: "",
    sem: 0,
  });

  // state for list of academic years
  const [years, setyears] = useState([]);
  // state for selected year
  const [year, setyear] = useState("");

  // state for input of sem
  const [sem, setsem] = useState("");

  // state for editing the year
  const [editYear, setEditYear] = useState({});

  // state for subject input
  const [subject, setsubject] = useState({});

  // state for subject list
  const [subjects, setsubjects] = useState([]);

  // state for academic years subjects list
  const [aySubjects, setAySubjects] = useState([]);

  // get the institutes from db before page loads
  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  // if data is available in redux state then set it to insitutes
  useEffect(() => {
    if (dbInstituteDegree) {
      let ins = [];
      dbInstituteDegree.forEach((i) => {
        ins.push(i.instituteName);
      });
      setinstitutes(ins);
    }
  }, [dbInstituteDegree]);

  // get degrees according to selected institute
  useEffect(() => {
    if (dbInstituteDegree) {
      let degs = [];
      dbInstituteDegree.forEach((i) => {
        if (i.instituteName === institute) {
          i.degrees.forEach((d) => {
            degs.push({ id: d._id, name: d.degreeName });
          });
        }
      });
      setdegrees(degs);
    }
  }, [institute]);

  // get academic year and subjects from db when selected degree get changed
  useEffect(() => {
    dispatch(getAcademicYear({ degreeId: degree }));
    dispatch(getSubjects(degree));
  }, [dispatch, degree]);

  // if academic year is present in redux then load that data in years
  useEffect(() => {
    if (dbAcademicYears) {
      setyears(dbAcademicYears);
    }
  }, [dbAcademicYears]);

  // if subjects is preset in redux then load that data in subjects
  useEffect(() => {
    if (dbSubjects) {
      setsubjects(dbSubjects);
    }
  }, [dbSubjects]);

  return (
    <div>
      <div className="row py-3">
        <SideNavbar />
        <div className="col-md-3 pb-3 pr-1">
          <div className="card h-100 shadow">
            <div className="card-body">
              <div className="p-3">
                <label className="control-label">Select Institute</label>
                <select
                  className="form-control form-select"
                  onChange={(e) => {
                    setinstitute(e.target.value);
                  }}
                >
                  <option disabled={institute ? true : false}>
                    Select an institute
                  </option>
                  {institutes &&
                    institutes.map((inst) => {
                      return <option>{inst}</option>;
                    })}
                </select>
              </div>
              <div className="p-3">
                <label className="control-label">Select Degree</label>
                <select
                  className="form-control form-select"
                  disabled={institute ? false : true}
                  onChange={(e) => {
                    setdegree(e.target.value);
                  }}
                >
                  <option disabled={degree ? true : false}>
                    Select an degree
                  </option>
                  {degrees &&
                    degrees.map((deg) => {
                      return <option value={deg.id}>{deg.name}</option>;
                    })}
                </select>
              </div>
              <div className="p-3">
                <label className="control-label">Add a new Academic Year</label>
                <input
                  type="text"
                  name="ayName"
                  placeholder="Academic Year"
                  className="form-control"
                  value={ay.year}
                  disabled={institute && degree ? false : true}
                  onChange={(e) => {
                    setay({
                      year: e.target.value,
                    });
                  }}
                ></input>
                <select
                  className="form-control form-select mt-2"
                  disabled={ay.year ? false : true}
                  onChange={(e) => {
                    setay({
                      ...ay,
                      sem: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="" disabled selected>
                    Select the number of semesters
                  </option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
                <button
                  className="btn btn-primary mt-2"
                  onClick={(e) => {
                    if (!ay.year) {
                      dispatch(
                        setAlert("Please insert academic Year", "danger")
                      );
                    } else {
                      if (ay.sem === 0) {
                        dispatch(
                          setAlert("Please select no. of semesters", "danger")
                        );
                      } else {
                        dispatch(addAcademicYear(degree, ay));
                      }
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md pb-3 pr-1">
          <div className="card h-100 shadow">
            {degree && (
              <div className="card-body">
                <div className="p-3">
                  <table className="table table-striped m-2">
                    <thead>
                      <tr>
                        <th>Academic Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {years.map((year) => {
                        return (
                          <tr>
                            <td>
                              {" "}
                              <button
                                className="btn btn-outline-info"
                                value={year.year}
                                onClick={(e) => {
                                  setyear(e.target.value);
                                }}
                              >
                                {year.year}
                              </button>{" "}
                            </td>
                            <td>
                              <span
                                className="fa fa-edit text-info"
                                data-toggle="modal"
                                data-target="#editInstitute"
                                onClick={(e) => {
                                  setEditYear({
                                    id: year._id,
                                    year: year.year,
                                  });
                                }}
                              ></span>
                            </td>
                            <td>
                              <span
                                className="fa fa-trash-alt text-danger"
                                onClick={(e) => {
                                  dispatch(deleteAY(year._id));
                                  dispatch(
                                    getAcademicYear({ degreeId: degree })
                                  );
                                }}
                              ></span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <h5 className="font-weight-bold p-3">{year && year}</h5>
                  {year && (
                    <select
                      className="form-control form-select m-3"
                      disabled={year ? false : true}
                      onChange={(e) => {
                        setsem(e.target.value);
                        let subs = [];
                        years.forEach((y) => {
                          if (y.year === year) {
                            y.semesters.forEach((s) => {
                              if (s.semesterNo == e.target.value) {
                                s.subjects.forEach((u) => {
                                  //
                                  subs.push({
                                    id: u.subjectId._id,
                                    sub: u.subjectId.subjectName,
                                  });
                                });
                              }
                            });
                          }
                        });
                        setAySubjects(subs);
                        //
                      }}
                    >
                      <option value="">Select the semester</option>
                      {years &&
                        years.map((y) => {
                          if (y.year === year) {
                            return y.semesters.map((s) => {
                              return (
                                <option value={s.semesterNo}>
                                  {s.semesterNo}
                                </option>
                              );
                            });
                          }
                          return undefined;
                        })}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {degree && year && (
          <div className="card h-100 shadow">
            <div className="card-body">
              <h3 className="font-weight-bold pb-3">Semester {sem}</h3>
              <div className="row g-2">
                <div class="col-auto">
                  <select
                    className="form-control form-select"
                    disabled={sem ? false : true}
                    id="list"
                    onChange={(e) => {
                      setsubject({
                        sub: e.nativeEvent.target[e.target.selectedIndex].text,
                        id: e.target.value,
                      });
                      //
                    }}
                  >
                    <option>Select the subjects</option>
                    {subjects &&
                      subjects.map((sub) => {
                        return (
                          <option key={sub._id} value={sub._id} id="sub">
                            {sub.subjectName}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div class="col-auto">
                  <button
                    class="btn btn-primary mb-3"
                    onClick={(e) => {
                      let s = aySubjects.find((f) => f.id === subject.id);
                      if (s !== undefined) {
                        dispatch(setAlert("Subject already exists", "danger"));
                      } else {
                        setAySubjects([...aySubjects, subject]);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="p-3">
                <table className="table table-striped m-2">
                  <thead>
                    <tr>
                      <th>Subjects</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {aySubjects.map((sub) => {
                      return (
                        <tr>
                          <td> {sub.sub}</td>

                          <td>
                            <span
                              className="fa fa-trash-alt text-danger"
                              onClick={(e) => {
                                setAySubjects(
                                  aySubjects.filter((e) => e.id !== sub.id)
                                );
                              }}
                            ></span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  className="btn btn-success"
                  onClick={(e) => {
                    dispatch(addAYSubjects(degree, year, aySubjects, sem));
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal for adding subjects */}
      <div
        class="modal fade"
        id="editInstitute"
        tabindex="-1"
        role="dialog"
        aria-labelledby="editInstituteLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editInstituteLabel">
                Edit Year
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label class="col-form-label">Year</label>
              <input
                type="text"
                class="form-control"
                value={editYear.year}
                onChange={(e) =>
                  setEditYear({
                    ...editYear,
                    year: e.target.value,
                  })
                }
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={(e) => {
                  dispatch(
                    updateAcademicYear(editYear.year, editYear.id, degree)
                  );
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of adding subject modal */}
    </div>
  );
}

export default AcademicYear;

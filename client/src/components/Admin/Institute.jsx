import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import {
  addInstituteName,
  addInstitutes,
  deleteDegree,
  deleteInstitute,
  editInstituteName,
  getInstitutes,
} from "../../actions/institutes_degree";
import SideNavbar from "./SideNavbar";

function Institute() {
  // To run the actions
  const dispatch = useDispatch();
  // Set the institute name and degrees and then pass this object in action
  const [formData, setFormData] = useState({
    instituteName: "",
    degrees: [],
  });

  // Institute array
  const [institutes, setInstitutes] = useState([]);

  // state for adding the new degrees
  const [newDegrees, setNewDegrees] = useState([]);

  // Institute for input field
  const [institute, setInstitute] = useState("");

  // Edit institute field value
  const [editInstitute, setEditInstitute] = useState({
    id: "",
    instituteName: "",
  });

  // Degree for input fields
  const [degree, setDegree] = useState("");

  // Get the institutes and degrees from the state InstituteDegree
  const oldInstitutes = useSelector(
    (state) => state.InstituteDegree.institutes
  );

  useEffect(() => {
    // Get the institutes from api and set it to state InstituteDegree
    dispatch(getInstitutes());
  }, [dispatch]);

  // call the method getInstitutes to set the state
  // Everytime the oldInstitutes changes this method will call
  useEffect(() => {
    // Checking if oldInstitutes are empty or not
    if (oldInstitutes) {
      let arrayOfInstitutes = oldInstitutes.map((inst) => {
        return { id: inst._id, instituteName: inst.instituteName };
      });
      setInstitutes(arrayOfInstitutes);
    }
  }, [oldInstitutes]);

  return (
    <div className="row py-3">
      <SideNavbar />
      {/* Institute */}
      <div className="col-md-3 pb-3 pr-1">
        <div className="card h-100 shadow">
          <div className="card-body">
            <div className="form-group">
              <div className="col-sm-10 row">
                <div className="col-sm">
                  <label for="instituteName" className="control-label">
                    Add new Institute Name
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    placeholder="Institute Name"
                    className="form-control"
                    onChange={(e) => setInstitute(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="p-3">
                <button
                  className="btn btn-primary"
                  value="Add"
                  onClick={(e) => {
                    if (institutes.find((e) => e.instituteName === institute)) {
                      dispatch(setAlert("Institute already exists.", "danger"));
                    } else {
                      dispatch(addInstituteName(institute));
                      dispatch(
                        setAlert(
                          "Add atleast 1 degree to add the institute.",
                          "info"
                        )
                      );
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Institute Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {institutes ? (
                  institutes.map((inst) => {
                    return (
                      <tr>
                        <td>
                          <button
                            className="btn"
                            onClick={(e) => {
                              setFormData({
                                ...formData,
                                instituteName: e.target.value,
                              });
                              oldInstitutes.forEach((old) => {
                                if (old.instituteName === e.target.value) {
                                  if (old.degrees) {
                                    let oldDegrees = old.degrees.map((d) => {
                                      return { id: d._id, name: d.degreeName };
                                    });

                                    setFormData((state) => ({
                                      ...state,
                                      degrees: oldDegrees,
                                    }));
                                  } else {
                                    setFormData((state) => ({
                                      ...state,
                                      degrees: [],
                                    }));
                                  }
                                }
                              });
                            }}
                            value={inst.instituteName}
                          >
                            {inst.instituteName}
                          </button>
                        </td>
                        <td>
                          <span
                            className="fa fa-edit text-info"
                            data-toggle="modal"
                            data-target="#editInstitute"
                            onClick={(e) =>
                              setEditInstitute({
                                id: inst.id,
                                instituteName: inst.instituteName,
                              })
                            }
                          ></span>
                        </td>
                        <td>
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              dispatch(deleteInstitute(inst.id));
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <h1>No data</h1>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Degree */}
      <div className="col-md-6 pb-3 pr-1">
        <div className="card h-100 shadow">
          {formData.instituteName && (
            <div className="card-body">
              <div className="form-group">
                <div className="col-sm-10 row">
                  <div className="col-sm-6">
                    <label for="degreeName" className="control-label">
                      Institute Name
                    </label>
                    <h4>
                      <span class="badge badge-secondary">
                        {formData.instituteName}
                      </span>
                    </h4>
                  </div>
                </div>
                <div className="col-sm-6">
                  <label for="degreeName" className="control-label">
                    Add a new Degree Name
                  </label>
                  <input
                    type="text"
                    name="degreeName"
                    className="form-control"
                    placeholder="Degree Name"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  ></input>
                </div>
                <div className="p-3">
                  <button
                    className="btn btn-primary"
                    value="Add"
                    onClick={(e) => {
                      // Checking if institute is selected or not
                      // if not then display alert message
                      if (formData.instituteName) {
                        // Checking if degree is entered or not
                        // otherwise display alert messsage
                        if (degree) {
                          oldInstitutes.forEach((old) => {
                            if (old.instituteName === formData.instituteName) {
                              if (old.degrees) {
                                let oldDegrees = old.degrees.map((d) => {
                                  return { id: d._id, name: d.degreeName };
                                });

                                setFormData((state) => ({
                                  ...state,
                                  degrees: oldDegrees,
                                }));
                              } else {
                                setFormData((state) => ({
                                  ...state,
                                  degrees: [],
                                }));
                              }
                            }
                          });
                          setNewDegrees([...newDegrees, degree]);
                          setDegree("");
                        } else {
                          dispatch(setAlert("Please enter degree", "danger"));
                        }
                      } else {
                        dispatch(
                          setAlert("Please select institute first", "danger")
                        );
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <table className="table table-striped m-2">
                <thead>
                  <tr>
                    <th className="w-50">Degrees</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.degrees.map((deg, id) => {
                    return (
                      <tr key={id}>
                        <td>{deg.name}</td>
                        <td>
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              dispatch(
                                deleteDegree(formData.instituteName, deg.id)
                              );
                              oldInstitutes.forEach((old) => {
                                if (
                                  old.instituteName === formData.instituteName
                                ) {
                                  if (old.degrees) {
                                    let oldDegrees = old.degrees.map((d) => {
                                      return { id: d._id, name: d.degreeName };
                                    });

                                    setFormData((state) => ({
                                      ...state,
                                      degrees: oldDegrees,
                                    }));
                                  } else {
                                    setFormData((state) => ({
                                      ...state,
                                      degrees: [],
                                    }));
                                  }
                                }
                              });
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {newDegrees && (
                <div>
                  <table className="table table-striped m-2">
                    <tbody>
                      {newDegrees &&
                        newDegrees.map((deg, id) => {
                          return (
                            <tr key={id}>
                              <td>{deg}</td>
                              <td>
                                <span
                                  className="fa fa-trash-alt text-danger"
                                  onClick={(e) => {
                                    const data = newDegrees.filter(
                                      (_, j) => id !== j
                                    );
                                    setNewDegrees(data);
                                  }}
                                ></span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                value="Save"
                className="btn btn-success"
                onClick={(e) => {
                  dispatch(addInstitutes(formData, newDegrees));
                  setNewDegrees([]);
                }}
              >
                Save
              </button>
              {/* Edit institute Dialog */}
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
                        Edit Institute Name
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
                      <label class="col-form-label">Institute Name</label>
                      <input
                        type="text"
                        class="form-control"
                        value={editInstitute.instituteName}
                        onChange={(e) =>
                          setEditInstitute({
                            ...editInstitute,
                            instituteName: e.target.value,
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
                            editInstituteName(
                              editInstitute.instituteName,
                              editInstitute.id
                            )
                          );
                        }}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End of edit institute */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Institute;

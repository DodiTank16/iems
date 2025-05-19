import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../actions/alert";
import { getInstitutes } from "../../actions/institutes_degree";
import { addResources, getResources } from "../../actions/resources";
import SideNavbar from "./SideNavbar";

function Resources() {
  // To call the acitons
  const dispatch = useDispatch();

  // Get the institutes data from redux state
  const preLoadedInstitutes = useSelector(
    (state) => state.InstituteDegree.institutes
  );

  //   Get the resources from redux state
  const preLoadedResources = useSelector((state) => state.Resources.resources);

  // State for storing the insitutes for this component's state
  const [institutes, setInstitutes] = useState([]);

  // State for storing the degrees for this component's state
  const [degrees, setDegrees] = useState([]);

  //   State for storing the classes for this component's state
  const [classes, setClasses] = useState([]);

  //   State for storing the labs for this component's state
  const [labs, setLabs] = useState([]);

  //   State for storeing lab code,normalCapacity and examCapacity
  const [lab, setLab] = useState({
    code: "",
    normalCapacity: 0,
    examCapacity: 0,
  });

  //   State for storing the classCode, normalcapacity and examCapacity
  const [classs, setClasss] = useState({
    code: "",
    normalCapacity: 0,
    examCapacity: 0,
  });

  //   State for storing the main formData for this component's state
  const [degreeId, setDegreeId] = useState("");

  // To get the insituted befor rendering UI
  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  //   Call this method everytime when preLoadedResources get changed
  useEffect(() => {
    setClasses(preLoadedResources.classes);
    setLabs(preLoadedResources.labs);
    //
  }, [preLoadedResources]);

  //   To set the classes state with preLoadedClasses
  useEffect(() => {
    if (degreeId) {
      setClasses(preLoadedResources.classes);
      setLabs(preLoadedResources.labs);
    }
  }, [degreeId]);

  // Call this method everytime when preloadedeinstitutes get changed
  useEffect(() => {
    setInstitutes(preLoadedInstitutes);
  }, [preLoadedInstitutes]);

  //   Save the classes and labs
  const save = () => {
    dispatch(addResources(degreeId, classes, labs));
  };

  return (
    <div>
      <div className="row py-3">
        <SideNavbar />
        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-body">
              <div className="pb-3">
                <label className="control-label">Select Institute</label>
                <select
                  className="form-control form-select"
                  onChange={(e) => {
                    let temp = institutes.find((inst) => {
                      if (inst._id === e.target.value) {
                        return inst.degrees;
                      }
                    });

                    setDegrees(temp.degrees);
                  }}
                >
                  <option disabled={degrees.length === 0 ? false : true}>
                    Select an institute
                  </option>
                  {institutes &&
                    institutes.map((inst, id) => {
                      return (
                        <option key={id} value={inst._id}>
                          {inst.instituteName}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="pb-2">
                <label className="control-label">Select Degree</label>
                <select
                  className="form-control form-select"
                  disabled={degrees.length === 0 ? true : false}
                  onChange={(e) => {
                    setDegreeId(e.target.value);
                    setClasses([]);
                    dispatch(getResources({ degreeId: e.target.value }));
                  }}
                >
                  <option disabled={degreeId ? true : false}>
                    {" "}
                    Select an degree
                  </option>
                  {degrees &&
                    degrees.map((deg, id) => {
                      return (
                        <option key={id} value={deg._id}>
                          {deg.degreeName}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="pb-3">
                <label for="instituteName" className="control-label">
                  Class Code
                </label>
                <input
                  type="text"
                  name="instituteName"
                  className="form-control"
                  value={classs.code}
                  disabled={degreeId ? false : true}
                  onChange={(e) => {
                    setClasss({
                      ...classs,
                      code: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label for="instituteName" className="control-label">
                    Normal capacity
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    className="form-control"
                    value={classs.normalCapacity}
                    disabled={classs.code ? false : true}
                    onChange={(e) => {
                      setClasss({
                        ...classs,
                        normalCapacity: Number(e.target.value),
                      });
                    }}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label for="instituteName" className="control-label">
                    Exam capacity
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    className="form-control"
                    value={classs.examCapacity}
                    disabled={classs.normalCapacity ? false : true}
                    onChange={(e) => {
                      setClasss({
                        ...classs,
                        examCapacity: Number(e.target.value),
                      });
                    }}
                  ></input>
                </div>
              </div>
              <button
                className="btn btn-primary mt-3"
                disabled={
                  classs.code &&
                  classs.examCapacity !== 0 &&
                  classs.normalCapacity !== 0
                    ? false
                    : true
                }
                onClick={(e) => {
                  if (
                    classs.code &&
                    classs.normalCapacity &&
                    classs.examCapacity
                  ) {
                    let classExists = classes.find(
                      (cl) => cl.code === classs.code
                    );
                    if (classExists) {
                      dispatch(
                        setAlert(
                          "Class with this code already exists.",
                          "danger"
                        )
                      );
                    } else {
                      setClasses([...classes, classs]);
                      dispatch(
                        setAlert(
                          "Class added. Please save it before leave",
                          "info"
                        )
                      );
                    }
                  } else {
                    dispatch(setAlert("Please all fields of class", "danger"));
                  }
                }}
              >
                Add Class
              </button>
              <div className="pb-3 pt-3">
                <label for="instituteName" className="control-label">
                  Lab Code
                </label>
                <input
                  type="text"
                  name="instituteName"
                  className="form-control"
                  value={lab.code}
                  disabled={degreeId ? false : true}
                  onChange={(e) => {
                    setLab({
                      ...lab,
                      code: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label for="instituteName" className="control-label">
                    Normal capacity
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    className="form-control"
                    value={lab.normalCapacity}
                    disabled={degreeId && lab.code !== "" ? false : true}
                    onChange={(e) => {
                      setLab({
                        ...lab,
                        normalCapacity: e.target.value,
                      });
                    }}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label for="instituteName" className="control-label">
                    Exam capacity
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    className="form-control"
                    disabled={
                      degreeId && lab.normalCapacity !== 0 ? false : true
                    }
                    value={lab.examCapacity}
                    onChange={(e) => {
                      setLab({
                        ...lab,
                        examCapacity: e.target.value,
                      });
                    }}
                  ></input>
                </div>
                <button
                  className="btn btn-primary m-3"
                  disabled={
                    lab.code &&
                    lab.examCapacity !== 0 &&
                    lab.normalCapacity !== 0
                      ? false
                      : true
                  }
                  onClick={(e) => {
                    if (lab.code && lab.normalCapacity && lab.examCapacity) {
                      let labExists = labs.find((la) => la.code === lab.code);
                      if (labExists) {
                        dispatch(
                          setAlert(
                            "Lab with this code already exists.",
                            "danger"
                          )
                        );
                      } else {
                        setLabs([...labs, lab]);
                        dispatch(
                          setAlert(
                            "Lab added. Please save it before leave",
                            "info"
                          )
                        );
                      }
                    } else {
                      dispatch(setAlert("Please all fields of Lab", "danger"));
                    }
                  }}
                >
                  Add Lab
                </button>
              </div>
              {classes && labs && (
                <button
                  className="btn btn-success my-3"
                  onClick={(e) => save()}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-3">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="font-weight-bold pb-3">Classes</h3>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Class Code</th>
                  <th>Normal Capacity</th>
                  <th>Exam Capacity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {classes &&
                  classes.map((clas) => {
                    return (
                      <tr>
                        <td>{clas.code}</td>
                        <td>{clas.normalCapacity}</td>
                        <td>{clas.examCapacity}</td>
                        <td>
                          {" "}
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              setClasses(
                                classes.filter((c) => c.code !== clas.code)
                              );
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {classes && labs && (
              <button className="btn btn-success my-3" onClick={(e) => save()}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="py-3">
        <div className="card shadow">
          <div className="card-body">
            <h3 className="font-weight-bold pb-3">Labs</h3>
            <table className="table table-striped m-2">
              <thead>
                <tr>
                  <th className="w-50">Lab Code</th>
                  <th>Normal Capacity</th>
                  <th>Exam Capacity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {labs &&
                  labs.map((la) => {
                    return (
                      <tr>
                        <td>{la.code}</td>
                        <td>{la.normalCapacity}</td>
                        <td>{la.examCapacity}</td>
                        <td>
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              setLabs(labs.filter((c) => c.code !== la.code));
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {classes && labs && (
              <button className="btn btn-success my-3" onClick={(e) => save()}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;

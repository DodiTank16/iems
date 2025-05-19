import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { getInstitutes } from '../../actions/institutes_degree';
import { addSuject, deleteSubject, getSubjects } from '../../actions/subject';
import SideNavbar from './SideNavbar';
function Subject() {
  // To call actions
  const dispatch = useDispatch();

  // Get the institutes from the state
  const preLoadedInstitutes = useSelector(
    (state) => state.InstituteDegree.institutes
  );

  // Get the subjects from the redux state
  const preLoadedSubjects = useSelector((state) => state.Subject.subjects);

  // State for this component to store the institutes
  const [institutes, setInstitutes] = useState([]);

  // State for this component to store the degrees
  const [degrees, setDegrees] = useState([]);

  // State for this component to store the subjects
  const [subjects, setSubjects] = useState([]);

  // This will store degreeId, subjectName, subjectCode
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    degreeId: '',
  });

  // Get the institutes from API and store it in state.
  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  // Set the institutes to local state from redux state
  useEffect(() => {
    setInstitutes(preLoadedInstitutes);
  }, [preLoadedInstitutes]);

  // Set the subjects to local state from redux state
  useEffect(() => {
    if (preLoadedSubjects) {
      setSubjects(preLoadedSubjects);
    }
  }, [preLoadedSubjects]);

  return (
    <div className='row py-3'>
      <SideNavbar />
      <div className='col-md-3 pb-3 pr-1'>
        <div className='card h-100 shadow'>
          <div className='card-body'>
            <div className='pb-3'>
              <label className='control-label'>Select Institute</label>
              <select
                className='form-control form-select'
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
            <div className='pb-2'>
              <label className='control-label'>Select Degree</label>
              <select
                className='form-control form-select'
                disabled={degrees.length === 0 ? true : false}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    degreeId: e.target.value,
                  });
                  setSubjects([]);
                  dispatch(getSubjects(e.target.value));
                }}
              >
                <option disabled={formData.degreeId ? true : false}>
                  {' '}
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
      <div className='col-md-6 pb-3 pr-1'>
        <div className='card h-100 shadow'>
          {formData.degreeId && (
            <div className='card-body'>
              <div className='form-group'>
                <div className='col-sm-10 row'>
                  <div className='col-sm-6'>
                    <label for='instituteName' className='control-label'>
                      Add a new Subject
                    </label>
                    <input
                      type='text'
                      name='instituteName'
                      placeholder='Subject Name'
                      className='form-control'
                      value={formData.subjectName}
                      disabled={formData.degreeId ? false : true}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          subjectName: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                  <div className='col-sm-6'>
                    <label
                      for='degreeName'
                      className='control-label'
                      style={{ color: 'transparent' }}
                    >
                      Subject Code
                    </label>
                    <input
                      type='text'
                      name='degreeName'
                      placeholder='Subject Code'
                      className='form-control'
                      value={formData.subjectCode}
                      disabled={formData.subjectName ? false : true}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          subjectCode: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                </div>
                <div className='p-3'>
                  <button
                    className='btn btn-primary'
                    onClick={(e) => {
                      if (
                        formData.degreeId &&
                        formData.subjectName &&
                        formData.subjectCode
                      ) {
                        dispatch(addSuject(formData));
                      } else {
                        dispatch(setAlert('Please fill all fields', 'danger'));
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <table className='table table-striped m-2'>
                <thead>
                  <tr>
                    <th className='w-50'>Subjects</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects &&
                    subjects.map((sub, id) => {
                      return (
                        <tr key={id}>
                          <td>{sub.subjectName}</td>
                          <td>
                            <span
                              className='fa fa-trash-alt text-danger'
                              onClick={(e) => {
                                dispatch(deleteSubject(sub._id));
                                dispatch(getSubjects(formData.degreeId));
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
        </div>
      </div>
    </div>
  );
}

export default Subject;

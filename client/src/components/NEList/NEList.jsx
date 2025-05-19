import React, { Fragment, useState, useEffect } from 'react';
import DropDown from '../layout/DropDown';
import { Link } from 'react-router-dom';
import { getPedagogySN } from '../../actions/pedagogy';
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from '../../actions/current';
import { getInstitutes } from '../../actions/institutes_degree';
import { getAcademicYear } from '../../actions/academic_year';
import { oddSems, evenSems } from '../../utils/defaults';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNotEligiblityList,
  getNotEligiblityList,
} from '../../actions/not_eligible';
import { setAlert } from '../../actions/alert';

// Main component for rendering the not eligible page

const NEList = () => {
  // Get the values from the state
  const dispatch = useDispatch();
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
  const { neList } = useSelector((state) => state.NotEligible);

  // Declaring and initializing the formData
  const [formData, setFormData] = useState({
    subjectName: '',
    componentName: '',
    neStudents: [],
    inputStudent: '',
    subjects: [],
    expType: '',
  });

  // Fetch from database if institues are not available
  useEffect(() => {
    if (institutes.length === 0) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institutes]);

  // Destructure formData
  const {
    subjectName,
    componentName,
    neStudents,
    inputStudent,
    subjects,
    expType,
  } = formData;

  // Function to update studentId
  const onStudentIdChange = (e) => {
    setFormData({
      ...formData,
      inputStudent: e.target.value,
    });
  };

  // Get value from input field and add it to student array
  function setStudentsArray() {
    setFormData({
      ...formData,
      neStudents: [...new Set([...neStudents, inputStudent])],
    });
  }

  // Removing the value from student array
  function removeStudentsArray(i) {
    setFormData({
      ...formData,
      neStudents: neStudents.filter((_, j) => i !== j),
    });
  }

  // Fetch pedagogies when semesterNo value changes
  useEffect(() => {
    semesterNo
      ? dispatch(
          getPedagogySN({
            academicYear: academicYears.filter(
              (ay) => ay.year === academicYear
            )[0]._id,
            semesterNo,
          })
        )
      : setFormData({ subjectName: '', componentName: '', neStudents: [] });
  }, [semesterNo, dispatch, academicYear, academicYears]);

  // Filter pedagogies of subjects if it has unit tests as components
  useEffect(() => {
    if (pedagogies !== null) {
      let subjectsTemp = pedagogies.map((pedagogy) => {
        let flag = false;
        pedagogy.components.forEach((component) => {
          if (
            component.name === 'Unit Test 1' ||
            component.name === 'Unit Test 2'
          )
            flag = true;
        });
        if (flag)
          return {
            subjectName:
              pedagogy.subject.subjectCode + '-' + pedagogy.subject.subjectName,
            id: pedagogy.subject._id,
          };
        else return undefined;
      });
      setFormData((state) => ({
        ...state,
        subjects: subjectsTemp.filter((subject) => subject !== undefined),
      }));
    }
  }, [pedagogies]);

  // Fetch not eligiblity lists
  useEffect(() => {
    if (componentName && subjectName) {
      dispatch(
        getNotEligiblityList({
          academicYear: academicYears.filter(
            (ay) => ay.year === academicYear
          )[0]._id,
          componentName,
          semester: semesterNo,
          subject: subjectName,
        })
      );
    }
  }, [
    componentName,
    subjectName,
    dispatch,
    academicYear,
    academicYears,
    semesterNo,
  ]);

  // Update neStutdents after fetching data from database
  useEffect(() => {
    if (neList) {
      let students = neList.map((student) => student.studentId);
      setFormData((state) => ({ ...state, neStudents: students }));
    }
  }, [neList]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(
          addNotEligiblityList({
            formData,
            semester: semesterNo,
            academicYearId: academicYears.filter(
              (ay) => ay.year === academicYear
            )[0]._id,
          })
        );
      }}
    >
      <div className='row py-3'>
        <div className='col-md-3 pb-3 pr-1'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <Fragment>
                <DropDown
                  id='ddInstitute'
                  title='Institute'
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

                    let drp = document.getElementById('ddDegree');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddDegree'
                  title='Degree'
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
                    let drp = document.getElementById('ddAcademicYear');
                    drp.disabled = false;
                  }}
                />
                <DropDown
                  id='ddAcademicYear'
                  title='Academic Year'
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
                    let drp = document.getElementById('ddSemesterGroup');
                    drp.disabled = false;
                  }}
                />
                <div className='row'>
                  <div className='col-md'>
                    <DropDown
                      id='ddSemesterGroup'
                      title='Semester Group'
                      options={['Even', 'Odd']}
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
                        let drp = document.getElementById('ddSemesterNo');
                        drp.disabled = false;
                      }}
                    />
                  </div>
                  <div className='col-md'>
                    <DropDown
                      id='ddSemesterNo'
                      title='Semester No.'
                      value={semesterNo}
                      isDisabled={
                        degree !== null &&
                        institute !== null &&
                        academicYear !== null &&
                        semesterGroup !== null
                          ? false
                          : true
                      }
                      options={'Even' === semesterGroup ? evenSems : oddSems}
                      onChange={(e) => {
                        dispatch(updateSemesterNo(e.target.value));
                        setFormData({ ...formData, subjectName: null });
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        <div className='col-md-3 pb-3 pr-1'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <h3 className='text-center'>NOT ELIGIBILITY LIST</h3>
              <div className='mb-3 form-group'>
                <label htmlFor='ddSubjects' className='form-label'>
                  Subject Name
                </label>
                <select
                  id='ddSubjects'
                  className='form-select form-control'
                  value={subjectName ? subjectName : ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      subjectName: e.target.value,
                      componentName: '',
                    });
                  }}
                  disabled={semesterNo ? false : true}
                  required
                >
                  <option value='' disabled>
                    Select Option
                  </option>
                  {subjects
                    ? subjects.map((subject) => (
                        <option
                          key={subjects.indexOf(subject)}
                          value={subject.id}
                        >
                          {subject.subjectName}
                        </option>
                      ))
                    : []}
                </select>
              </div>
              <DropDown
                title='Name of Component'
                id='ddNameOfComponents'
                isDisabled={semesterNo && subjectName ? false : true}
                value={componentName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    componentName: e.target.value,
                  });
                }}
                options={
                  pedagogies.length > 0 && subjectName
                    ? pedagogies
                        .filter(
                          (pedagogy) => pedagogy.subject._id === subjectName
                        )[0]
                        .components.filter(
                          (component) =>
                            component.name === 'Unit Test 1' ||
                            component.name === 'Unit Test 2'
                        )
                        .map((component) => component.name)
                    : []
                }
              />
              <DropDown
                title='Export Data For'
                id='ddExpData'
                isDisabled={semesterNo && componentName ? false : true}
                value={expType}
                onChange={(e) => {
                  setFormData({ ...formData, expType: e.target.value });
                }}
                isRequired={false}
                options={['Subject', 'Semester']}
              />
              <Link
                to={
                  expType === 'Subject'
                    ? '/neList/export-data/' + subjectName + '/' + componentName
                    : '/neList/export-data/' + expType + '/' + componentName
                }
                className={expType ? 'btn btn-dark' : 'btn btn-dark disabled'}
              >
                Export Data
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-6 pb-3'>
          <div className='card h-100 shadow'>
            {componentName && (
              <div className='card-body'>
                <div className='row'>
                  <div className='col-lg'>
                    <div className='form-group'>
                      <label className='h5 mb-2'>Not Eligible Student ID</label>
                      <input
                        className='form-control'
                        placeholder='Example: 18CE000'
                        title='Not Eligible student ID'
                        required
                        value={inputStudent ? inputStudent : ''}
                        onChange={(e) => {
                          onStudentIdChange(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className='col-lg'></div>
                </div>
                <div className='row'>
                  <div className='col-lg'>
                    <input
                      value='Add'
                      type='button'
                      padding-left='0px'
                      className='btn btn-success ml-1'
                      onClick={(e) => {
                        e.preventDefault();
                        if (inputStudent) setStudentsArray();
                        else
                          dispatch(
                            setAlert('The student Id field is empty', 'danger')
                          );
                      }}
                    />
                  </div>
                  <div className='col-lg'></div>
                </div>
                <div className='row '>
                  {neStudents.length > 0 && (
                    <div className='col table-responsive'>
                      <p className='text-center py-3 h5 text-danger'>
                        Not Eligible Students For {componentName}
                      </p>
                      <table className='table table-striped table-sm table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Student ID</th>
                            <th scope='col'></th>
                          </tr>
                        </thead>
                        <tbody>
                          {neStudents.map((id, i) => {
                            return (
                              <tr key={i}>
                                <th scope='row'>{i + 1}</th>
                                <td>{id}</td>
                                <td>
                                  <span
                                    className='fa fa-trash-alt text-danger'
                                    onClick={(e) => {
                                      removeStudentsArray(i);
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
                {neStudents.length > 0 && (
                  <div className='row'>
                    <div className='col-lg'>
                      <input
                        value='Save'
                        type='submit'
                        className='btn btn-primary ml-1'
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default NEList;

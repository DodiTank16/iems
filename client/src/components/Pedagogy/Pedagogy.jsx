import React, { Fragment, useEffect, useState } from 'react';
import DropDown from '../layout/DropDown';
import Component from './Component';
import { useDispatch, useSelector } from 'react-redux';
import { addPedagogy, getPedagogy } from '../../actions/pedagogy';
import {
  updateInstitute,
  updateAcademicYear,
  updateDegree,
  updateSemesterGroup,
  updateSemesterNo,
} from '../../actions/current';
import { getInstitutes } from '../../actions/institutes_degree';
import { getAcademicYear } from '../../actions/academic_year';
import { setAlert } from '../../actions/alert';
import { Link } from 'react-router-dom';
import { oddSems, evenSems } from '../../utils/defaults';

const Pedagogy = () => {
  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Get data from current state using useSelector
  const { institutes } = useSelector((state) => state.InstituteDegree);
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const { pedagogy } = useSelector((state) => state.Pedagogy);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);

  // Creating formData, expType and total states using useState
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    subjectName: null,
    noOfComponents: 1,
  });
  const [expType, setExpType] = useState('');

  // Destructure formData
  const { subjectName, noOfComponents } = formData;

  // Filter subjects based on semester number
  const getSubjects = (semNo) => {
    return academicYears
      .filter((ay) => ay.year === academicYear)[0]
      .semesters.filter((sem) => sem.semesterNo === parseInt(semNo))[0]
      .subjects.map(({ subjectId }) => {
        return {
          subjectName: subjectId.subjectCode + '-' + subjectId.subjectName,
          id: subjectId._id,
        };
      });
  };

  // Store subjects in state using useState
  const [subjects, setSubjects] = useState(
    academicYear && semesterNo && institute && degree && semesterGroup
      ? getSubjects(semesterNo).sort()
      : []
  );

  // Render pedagogy components onto the screen
  const renderComponents = () => {
    const components = [];
    for (let index = 0; index < noOfComponents; index++) {
      components.push([
        <Component
          index={index + 1}
          key={index}
          cMode={formData['c' + index + '-Mode']}
          cName={formData['c' + index + '-Name']}
          cWeightage={formData['c' + index + '-Weightage']}
          onNameChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Name']: e.target.value,
            });
          }}
          onModeChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Mode']: e.target.value,
            });
          }}
          onWeightageChanged={(e) => {
            setFormData({
              ...formData,
              ['c' + index + '-Weightage']: e.target.value,
            });
          }}
        />,
      ]);
    }
    return components;
  };

  // Fetch from institues if not available
  useEffect(() => {
    if (institute == null) {
      dispatch(getInstitutes());
    }
  }, [dispatch, institute]);

  // Fetch pedagogy for current subject
  useEffect(() => {
    subjectName && dispatch(getPedagogy({ subjectId: subjectName }));
  }, [subjectName, dispatch]);

  // Update number of components based on pedagogy object
  useEffect(() => {
    if (subjectName && pedagogy !== null) {
      setFormData((state) => ({
        subjectName,
        noOfComponents: pedagogy.components.length,
      }));
    } else {
      setFormData((state) => ({ subjectName, noOfComponents: 1 }));
    }
  }, [pedagogy]);

  // Add component to formdata if subjectName or number of components change
  useEffect(() => {
    if (subjectName && pedagogy !== null) {
      const fd = { ...formData };
      for (let i = 0; i < pedagogy.components.length; i++) {
        fd['c' + i + '-Name'] = pedagogy.components[i].name;
        fd['c' + i + '-Mode'] = pedagogy.components[i].mode;
        fd['c' + i + '-Weightage'] = pedagogy.components[i].weightAge;
      }
      setFormData(fd);
    } else {
      setFormData({
        noOfComponents,
        subjectName,
      });
    }
  }, [noOfComponents, subjectName]);

  // Update total when formData changes
  useEffect(() => {
    if (subjectName) {
      let t = 0;
      for (let i = 0; i < formData.noOfComponents; i++) {
        if (!isNaN(parseInt(formData['c' + i + '-Weightage'])))
          t += parseInt(formData['c' + i + '-Weightage']);
      }
      setTotal(t);
    }
  }, [formData, subjectName]);

  // Update color based on total value
  useEffect(() => {
    if (total !== 30) {
      document.getElementById('lblTotal').style.color = 'red';
    } else {
      document.getElementById('lblTotal').style.color = 'green';
    }
  }, [total, dispatch]);

  return (
    <form
      // Add or update pedagogy on submit if total is 30
      onSubmit={(e) => {
        e.preventDefault();
        if (total === 30) {
          dispatch(
            addPedagogy(
              formData,
              semesterNo,
              academicYears.filter((ay) => ay.year === academicYear)[0]._id
            )
          );
        } else {
          dispatch(setAlert('Total Weightage cannot excced 30.', 'danger'));
        }
      }}
    >
      <div className='row py-3'>
        {/* Card 1: Render dropdowns for institute, degree, academic year, semester Group and semester number */}
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
                        setSubjects(getSubjects(e.target.value));
                        setFormData({ subjectName: null, noOfComponents: 1 });
                        setTotal(0);
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            </div>
          </div>
        </div>
        {/* Card 2: Render dropdowns for subject name, number of components type of export*/}
        <div className='col-md-3 pb-3 pr-1'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              <h3 className='text-center'>PEDAGOGY</h3>
              <div className='mb-3 form-group'>
                <label htmlFor='ddSubjects' className='form-label'>
                  Subject
                </label>
                <select
                  id='ddSubjects'
                  className='form-select form-control'
                  onChange={(e) => {
                    setFormData({
                      subjectName: e.target.value,
                      noOfComponents: 1,
                    });
                  }}
                  value={subjectName ? subjectName : ''}
                  disabled={semesterNo && academicYear ? false : true}
                  required
                >
                  <option value='' disabled>
                    Select Option
                  </option>
                  {subjects.map((subject) => (
                    <option key={subjects.indexOf(subject)} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <DropDown
                title='Number of Components'
                id='ddNoOfComponents'
                isDisabled={semesterNo && subjectName ? false : true}
                value={noOfComponents}
                onChange={(e) => {
                  setFormData({ ...formData, noOfComponents: e.target.value });
                }}
                options={['1', '2', '3', '4', '5']}
              />
              <DropDown
                title='Export Data For'
                id='ddExpData'
                isDisabled={semesterNo ? false : true}
                value={expType}
                onChange={(e) => {
                  setExpType(e.target.value);
                }}
                isRequired={false}
                options={['Academic Year', 'Semester Group', 'Semester Number']}
              />
              <Link
                to={'/pedagogy/export-data/' + expType}
                className={expType ? 'btn btn-dark' : 'btn btn-dark disabled'}
              >
                Export Data
              </Link>
            </div>
          </div>
        </div>
        {/* Card 3: Placeholder for rendering pedagogies */}
        <div className='col-md-6 pb-3'>
          <div className='card h-100 shadow'>
            <div className='card-body'>
              {subjectName && renderComponents()}
              <div className='d-flex justify-content-between p-2'>
                <p className='h4'>Total:</p>
                <p id='lblTotal' className='h4'>
                  {total}
                </p>
              </div>
              <input type='submit' value='Submit' className='btn btn-primary' />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Pedagogy;

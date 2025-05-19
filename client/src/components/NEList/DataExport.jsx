import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { Redirect, useParams } from 'react-router';

import {
  alignment,
  border,
  dataFont,
  headerFill,
  headerFont,
  subHeader1Fill,
  headers,
  subHeader3Fill,
} from '../../utils/defaults';
import { getPedagogySN } from '../../actions/pedagogy';
import {
  getNotEligiblityList,
  getNotEligiblityLists,
} from '../../actions/not_eligible';

function DataExport() {
  // Get export type from url query string using useParams
  const { expType, componentName } = useParams();

  // Get data from current state using useSelector
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);
  const { neList, neLists } = useSelector((state) => state.NotEligible);
  const { pedagogies } = useSelector((state) => state.Pedagogy);

  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Fecth pedagogies if not present
  useEffect(() => {
    dispatch(
      getPedagogySN({
        academicYear: academicYears.filter((ay) => ay.year === academicYear)[0]
          ._id,
        semesterNo,
      })
    );
  }, [semesterNo, dispatch, academicYear, academicYears]);

  const [subjectName, setSubjectName] = useState('');

  // Get not eligibility lists for semester or subject as per export Type and store it in state
  useEffect(() => {
    if (academicYears.length > 0 && expType) {
      const AYId = academicYears.filter((ay) => ay.year === academicYear)[0]
        ._id;

      if (expType === 'Semester')
        dispatch(
          getNotEligiblityLists({ academicYear: AYId, semester: semesterNo })
        );
      else {
        dispatch(
          getNotEligiblityList({
            academicYear: AYId,
            semester: semesterNo,
            subject: expType,
            componentName,
          })
        );
        let pedagogy = pedagogies.filter(
          (pedagogy) => pedagogy.subject._id === expType
        )[0];
        setSubjectName(
          pedagogy.subject.subjectCode + ' - ' + pedagogy.subject.subjectName
        );
      }
    }
  }, [
    academicYears,
    academicYear,
    semesterNo,
    expType,
    dispatch,
    componentName,
    pedagogies,
  ]);

  // Render not eligible students of one subject onto the screen
  const renderNEList = ({ neList, subjectName, i = 1 }) => {
    return (
      neList &&
      neList.length > 0 && (
        <Fragment>
          <thead key={i + 1}>
            <tr>
              <th colSpan='4' scope='col' className='text-center'>
                {subjectName}
              </th>
            </tr>
            <tr>
              <th scope='col'>Sr. No.</th>
              <th scope='col'>Student Id</th>
            </tr>
          </thead>
          <tbody>
            {neList.map((student, index) => {
              return (
                <Fragment>
                  <tr key={index}>
                    <th style={{ padding: '0.5rem' }} scope='row'>
                      {index + 1}
                    </th>
                    <td style={{ padding: '0.5rem' }}>{student.studentId}</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Fragment>
      )
    );
  };

  // Render not eligible students of all subjects onto the screen
  const renderNELists = () => {
    return (
      neLists &&
      neLists.length > 0 && (
        <Fragment>
          {neLists
            .filter((ne) => ne.componentName === componentName)
            .map((ne, i) => {
              let pedagogy = pedagogies.filter(
                (pedagogy) => pedagogy.subject._id === ne.subject
              )[0];

              return (
                <Fragment key={i}>
                  {renderNEList({
                    neList: ne.neStudents,
                    subjectName:
                      pedagogy.subject.subjectCode +
                      ' - ' +
                      pedagogy.subject.subjectName,
                    i,
                  })}
                </Fragment>
              );
            })}
        </Fragment>
      )
    );
  };

  // Sub-function to add neList for each subject
  const addNotEligibilityList = (neList, subjectName, worksheet, row, cols) => {
    worksheet.mergeCells(
      `${cols[0][0]}${row}:${cols[cols.length - 1][1]}${row}`
    );
    let cell = worksheet.getCell(`${cols[0][0]}${row}`);
    cell.font = headerFont;
    cell.border = border;
    cell.fill = subHeader3Fill;
    cell.value = subjectName;
    row++;
    neList.forEach((student, i) => {
      let dataList = [i + 1, student.studentId];
      for (let j = 0; j < dataList.length; j++) {
        worksheet.mergeCells(`${cols[j][0]}${row}:${cols[j][1]}${row}`);
        let cell = worksheet.getCell(`${cols[j][0]}${row}`);
        cell.font = dataFont;
        cell.border = border;
        cell.value = dataList[j];
      }
      row++;
    });
    return { worksheet, row };
  };

  const excelExport = (e) => {
    e.preventDefault();
    // Create new Excel file and name it
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet('Not Eligible Students');
    let sheetHeaders = [
      ...headers,
      `Academic Year (${academicYear}) ${semesterGroup} SEMESTER (SEMESTER: ${semesterNo})`,
      `Not Eligible Students for ${componentName}`,
    ];

    let cols = [
      ['B', 'E'],
      ['F', 'J'],
    ];

    let titles = ['Sr.No', 'Student Id'];

    // Add header to the worksheet
    for (let i = 1; i <= 11; i++) {
      if (i <= sheetHeaders.length) {
        worksheet.mergeCells(`B${i}:J${i}`);
        const cell = worksheet.getCell(`B${i}`);
        cell.fill = headerFill;
        cell.border = border;
        cell.value = sheetHeaders[i - 1].toUpperCase();
      } else if (i === sheetHeaders.length + 1) {
        for (let j = 0; j < titles.length; j++) {
          worksheet.mergeCells(`${cols[j][0]}${i}:${cols[j][1]}${i}`);
          let cell = worksheet.getCell(`${cols[j][0]}${i}`);
          cell.font = headerFont;
          cell.border = border;
          cell.fill = subHeader1Fill;
          cell.value = titles[j];
        }
      }
      worksheet.getColumn(i).font = headerFont;
      worksheet.getColumn(i).alignment = alignment;
    }

    // Add not eligble students based on the value of expType i.e. export type mentioned in query string
    let row = sheetHeaders.length + 2;
    if (expType === 'Semester') {
      neLists
        .filter((ne) => ne.componentName === componentName)
        .forEach((ne) => {
          let pedagogy = pedagogies.filter(
            (pedagogy) => pedagogy.subject._id === ne.subject
          )[0];
          const x = addNotEligibilityList(
            ne.neStudents,
            pedagogy.subject.subjectCode + ' - ' + pedagogy.subject.subjectName,
            worksheet,
            row,
            cols
          );
          worksheet = x.worksheet;
          row = x.row;
        });
    } else {
      let pedagogy = pedagogies.filter(
        (pedagogy) => pedagogy.subject._id === expType
      )[0];
      const x = addNotEligibilityList(
        neList,
        pedagogy.subject.subjectCode + ' - ' + pedagogy.subject.subjectName,
        worksheet,
        row,
        cols
      );
      worksheet = x.worksheet;
    }

    // Create excel file from the create worksheet and save it
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `NEList(${componentName}).xlsx`
      );
    });
  };

  // Redirect to NEList.js if exportType, institute, degree, academicyear /
  // semesterNo or semestergroup is null else render the proper headers and pedagogies
  return expType &&
    institute &&
    degree &&
    academicYear &&
    semesterGroup &&
    semesterNo ? (
    <div className='row py-3' style={{ lineHeight: 1.15 }}>
      <div className='col-md'>
        <div className='card shadow-sm'>
          <div className='card-header bg-primary text-white'>
            <p className='h2 text-center'>
              <u style={{ letterSpacing: '0.0325em' }}>Not Eligibility List</u>
            </p>
            <button
              type='button'
              className='btn btn-light float-right'
              onClick={(e) => excelExport(e)}
            >
              Export Data <i className='fa fa-download'></i>
            </button>
          </div>
          <div className='card-body '>
            <div className='row pb-3'>
              <div className='col-md text-center'>
                <p className='h3'>
                  <u>Charotar University of Science and Technology, Changa</u>
                </p>
              </div>
            </div>
            <div className='row'>
              <div className='col text-center'>
                <p className='h5'>Institute: {institute} </p>
              </div>
            </div>
            <div className='row p-3'>
              <div className='col-md-6 text-center'>
                <p className='h5'>Degree: {degree} </p>
                <p className='h5'>Academic Year: {academicYear}</p>
              </div>
              <div className='col-md-6 text-center'>
                <p className='h5'>Semester Group: {semesterGroup}</p>
                <p className='h5'>Semester Number: {semesterNo}</p>
              </div>
            </div>
            <div className='row pb-3'>
              <div className='col text-center'>
                <p className='h5'>Test: {componentName} </p>
              </div>
            </div>
            <div className='row mx-1 table-responsive'>
              <table className='table table-striped'>
                {expType === 'Semester'
                  ? renderNELists()
                  : renderNEList({ neList, subjectName })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/neList' />
  );
}

export default DataExport;

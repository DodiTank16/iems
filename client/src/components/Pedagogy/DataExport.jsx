import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import {
  getPedagogyAY,
  getPedagogySG,
  getPedagogySN,
} from '../../actions/pedagogy';
import {
  alignment,
  allSems,
  border,
  dataFont,
  evenSems,
  headerFill,
  headerFont,
  headers,
  oddSems,
  subHeader1Fill,
  subHeader2Fill,
  subHeader3Fill,
} from '../../utils/defaults';

function DataExport() {
  // Get export type from url query string using use
  const { expType } = useParams();

  // Get data from current state using useSelector
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const {
    institute,
    degree,
    academicYear,
    semesterGroup,
    semesterNo,
  } = useSelector((state) => state.CurrentState);
  const { pedagogies } = useSelector((state) => state.Pedagogy);

  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Get pedagogies based on the exportType specfied in the query string
  useEffect(() => {
    if (academicYear) {
      const AYId = academicYears.filter((ay) => ay.year === academicYear)[0]
        ._id;
      switch (expType) {
        case 'Academic Year':
          dispatch(getPedagogyAY({ academicYear: AYId }));
          break;
        case 'Semester Group':
          dispatch(getPedagogySG({ semesterGroup, academicYear: AYId }));
          break;
        case 'Semester Number':
          dispatch(getPedagogySN({ semesterNo, academicYear: AYId }));
          break;
        default:
          break;
      }
    }
  }, [
    academicYear,
    academicYears,
    dispatch,
    expType,
    semesterGroup,
    semesterNo,
  ]);

  // Render pedagogies onto the screen for each semester of the specified academic year
  const renderPedagogies = (pedagogies) => {
    return (
      pedagogies.length > 0 && (
        <Fragment>
          {pedagogies.map(({ subject, components }, j) => {
            return (
              <Fragment>
                <thead key={j}>
                  <tr>
                    <th colSpan='4' scope='col' className='text-center'>
                      {subject.subjectCode + ' - ' + subject.subjectName}
                    </th>
                  </tr>
                  <tr>
                    <th scope='col'>Sr. No.</th>
                    <th scope='col'>Component</th>
                    <th scope='col'>Mode</th>
                    <th scope='col'>Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component, i) => {
                    return (
                      <Fragment>
                        <tr key={i}>
                          <th style={{ padding: '0.5rem' }} scope='row'>
                            {i + 1}
                          </th>
                          <td style={{ padding: '0.5rem' }}>
                            {component.name}
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            {component.mode}
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            {component.weightAge}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </Fragment>
            );
          })}
        </Fragment>
      )
    );
  };

  // Render pedagogies for all semesters all semesters of current semesterGroup
  const renderSemesterPedagogies = (semesterGroup) => {
    let semesters = [];
    if (semesterGroup === 'Even') semesters = evenSems;
    else if (semesterGroup === 'Odd') semesters = oddSems;
    else semesters = allSems;

    return semesters.map((i) => (
      <Fragment key={i}>
        <thead key={i}>
          <tr>
            <th colSpan='4' scope='col'>
              Semester: {i}
            </th>
          </tr>
        </thead>
        {renderPedagogies(
          pedagogies.filter((pedagogy) => pedagogy.semester === parseInt(i))
        )}
      </Fragment>
    ));
  };

  // Sub-function to add pedagogies for each semester
  const addPedagogies = (pedagogies, worksheet, row, cols) => {
    for (let i = 0; i < pedagogies.length; i++) {
      const { subject, components } = pedagogies[i];
      // Row For SubjectName
      worksheet.mergeCells(`B${row}:K${row}`);
      let cell = worksheet.getCell(`B${row}`);
      cell.fill = subHeader3Fill;
      cell.border = border;
      cell.value =
        subject.subjectCode + ' - ' + subject.subjectName.toUpperCase();
      row++;
      // Loop Through components
      for (let k = 0; k < components.length; k++) {
        const dataList = [
          k + 1,
          components[k].name,
          components[k].mode,
          components[k].weightAge,
        ];
        for (let j = 0; j < dataList.length; j++) {
          worksheet.mergeCells(`${cols[j][0]}${row}:${cols[j][1]}${row}`);
          let cell = worksheet.getCell(`${cols[j][0]}${row}`);
          cell.font = dataFont;
          cell.border = border;
          cell.value = dataList[j];
        }
        row++;
      }
    }
    return { worksheet, row };
  };

  // Function to create a excel sheet and add headers and dowload it.
  const excelExport = (e) => {
    e.preventDefault();
    // Create new Excel file and name it
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet('Pedagogy');
    let sheetHeaders = [
      ...headers,
      expType === 'Academic Year'
        ? `Academic Year (${academicYear})`
        : expType === 'Semester Group'
        ? `Academic Year (${academicYear}) ${semesterGroup} SEMESTER`
        : `Academic Year (${academicYear}) ${semesterGroup} SEMESTER (SEMESTER: ${semesterNo})`,
      'PEDAGOGY',
    ];

    let cols = [
      ['B', 'B'],
      ['C', 'E'],
      ['F', 'H'],
      ['I', 'K'],
    ];
    let titles = ['Sr.No', 'Component', 'Mode', 'WeightAge'];

    // Add header to the worksheet
    for (let i = 1; i <= 11; i++) {
      if (i <= sheetHeaders.length) {
        worksheet.mergeCells(`B${i}:K${i}`);
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

    // Add pedagogies based on the value of expType i.e. export type mentioned in query string
    switch (expType) {
      case 'Academic Year':
        for (let i = 1, row = sheetHeaders.length + 2; i <= 8; i++) {
          worksheet.mergeCells(`B${row}:K${row}`);
          let cell = worksheet.getCell(`B${row}`);
          cell.fill = subHeader2Fill;
          cell.border = border;
          cell.value = `Semester: ${i}`;
          row++;
          const x = addPedagogies(
            pedagogies.filter((pedagogy) => pedagogy.semester === i),
            worksheet,
            row,
            cols
          );
          worksheet = x.worksheet;
          row = x.row;
        }
        break;
      case 'Semester Group':
        for (
          let i = semesterGroup === 'Even' ? 2 : 1,
            row = sheetHeaders.length + 2;
          i <= 8;
          i += 2
        ) {
          worksheet.mergeCells(`B${row}:K${row}`);
          let cell = worksheet.getCell(`B${row}`);
          cell.fill = subHeader2Fill;
          cell.border = border;
          cell.value = `Semester: ${i}`;
          row++;
          const x = addPedagogies(
            pedagogies.filter((pedagogy) => pedagogy.semester === i),
            worksheet,
            row,
            cols
          );
          worksheet = x.worksheet;
          row = x.row;
        }
        break;
      case 'Semester Number':
        const x = addPedagogies(
          pedagogies,
          worksheet,
          sheetHeaders.length + 2,
          cols
        );
        worksheet = x.worksheet;
        break;
      default:
        break;
    }

    // Create excel file from the create worksheet and save it
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Pedagogy(${academicYear}).xlsx`
      );
    });
  };

  // Redirect to Pedagogy.js if exportType, institute, degree, academicyear /
  // or semestergroup is null else render the proper headers and pedagogies
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
              <u style={{ letterSpacing: '0.0325em' }}>PEDAGOGY</u>
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
              <div
                className={
                  expType === 'Academic Year' ? 'col' : 'col-md-6 text-center'
                }
              >
                <p className='h5'>Degree: {degree} </p>
                <p className='h5'>Academic Year: {academicYear}</p>
              </div>
              <div className='col-md-6 text-center'>
                {expType === 'Semester Group' && (
                  <p className='h5'>Semester Group: {semesterGroup}</p>
                )}
                {expType === 'Semester Number' && (
                  <Fragment>
                    <p className='h5'>Semester Group: {semesterGroup}</p>
                    <p className='h5'>Semester Number: {semesterNo}</p>
                  </Fragment>
                )}
              </div>
            </div>
            <div className='row mx-1 table-responsive'>
              <table className='table table-striped'>
                {expType === 'Semester Number' && renderPedagogies(pedagogies)}
                {expType === 'Semester Group' &&
                  renderSemesterPedagogies(semesterGroup)}
                {expType === 'Academic Year' && renderSemesterPedagogies(null)}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/pedagogy' />
  );
}

export default DataExport;

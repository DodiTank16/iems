import moment from "moment";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { Redirect, useParams } from "react-router";
import { getExamScheduleSG } from "../../actions/exam_schedule";
import { getPedagogySG } from "../../actions/pedagogy";
import {
  alignment,
  border,
  dataFont,
  headerFill,
  headerFont,
  subHeader2Fill,
  subHeader1Fill,
  evenSems,
  oddSems,
  headers,
} from "../../utils/defaults";

function DataExport() {
  // Get export type from url query string using useParams
  const { expType } = useParams();

  // Get data from current state using useSelector
  const { academicYears } = useSelector((state) => state.AcademicYear);
  const { examSchedules } = useSelector((state) => state.ExamSchedule);
  const { institute, degree, academicYear, semesterGroup } = useSelector(
    (state) => state.CurrentState
  );
  const { pedagogies } = useSelector((state) => state.Pedagogy);

  // Create an object to dispatch actions using useDispatch
  const dispatch = useDispatch();

  // Get pedagogies and examschedules for current semester group and store it in state
  useEffect(() => {
    if (academicYears.length > 0) {
      const AYId = academicYears.filter((ay) => ay.year === academicYear)[0]
        ._id;
      dispatch(getPedagogySG({ semesterGroup, academicYear: AYId }));
      dispatch(
        getExamScheduleSG({
          academicYear: AYId,
          semesterGroup,
          testName: expType,
        })
      );
    }
  }, [academicYears, academicYear, semesterGroup, expType, dispatch]);

  // Render schedules onto the screen for each semester
  const renderSchedule = (pedagogies, examSchedule) => {
    let subject;
    return pedagogies.map((pedagogy) =>
      pedagogy.components.map((component) => {
        if (expType === component["name"]) {
          subject = pedagogy.subject;
          return examSchedule.schedule.map((schedule, i) => {
            if (subject._id === schedule.subjectId._id) {
              return (
                // Schedule for each subject
                <Fragment key={i}>
                  <tr>
                    <td style={{ padding: "0.5rem" }}>
                      {schedule.subjectId.subjectCode}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {schedule.subjectId.subjectName}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {schedule.from.split(",")[0]}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {moment(schedule.from.split(",")[0]).format("dddd")}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {moment(schedule.from).format("hh:mm a") +
                        " to " +
                        moment(schedule.to).format("hh:mm a")}
                    </td>
                  </tr>
                </Fragment>
              );
            } else return <Fragment />;
          });
        } else return <Fragment />;
      })
    );
  };

  // Render all the schedules for each semester onto the screen
  const renderSchedulesSemester = () => {
    let semesters = [];
    if (semesterGroup === "Even") semesters = evenSems;
    else semesters = oddSems;

    return (
      <Fragment>
        {semesters.map((semester, iSem) => {
          let examSchedule = examSchedules.filter(
            (examSchedule) => examSchedule.semester === parseInt(semester)
          );
          if (examSchedule.length === 1) {
            return (
              <Fragment>
                <thead key={iSem}>
                  <tr>
                    <th colSpan="5" className="text-center" scope="col">
                      Semester: {semester}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Subject Code</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Day</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody key={iSem + 1}>
                  {renderSchedule(
                    pedagogies.filter(
                      (pedagogy) => pedagogy.semester === parseInt(semester)
                    ),
                    examSchedule[0]
                  )}
                </tbody>
              </Fragment>
            );
          } else return <Fragment />;
        })}
      </Fragment>
    );
  };

  // Sub-function to add examschedules for each semester
  const addExamSchedule = (pedagogies, examSchedules, worksheet, row, cols) => {
    let subject;
    pedagogies.forEach((pedagogy) =>
      pedagogy.components.forEach((component) => {
        if (expType === component["name"]) {
          subject = pedagogy.subject;
          examSchedules.forEach((examSchedule) => {
            for (let k = 0; k < examSchedule.schedule.length; k++) {
              let schedule = examSchedule.schedule[k];
              if (subject._id === schedule.subjectId._id) {
                let schedule = examSchedule.schedule[k];
                let dataList = [
                  schedule.subjectId.subjectCode,
                  schedule.subjectId.subjectName,
                  schedule.from.split(",")[0],
                  moment(schedule.from.split(",")[0]).format("dddd"),
                  moment(schedule.from).format("hh:mm a") +
                    " to " +
                    moment(schedule.to).format("hh:mm a"),
                ];
                for (let j = 0; j < dataList.length; j++) {
                  worksheet.mergeCells(
                    `${cols[j][0]}${row}:${cols[j][1]}${row}`
                  );
                  let cell = worksheet.getCell(`${cols[j][0]}${row}`);
                  cell.font = dataFont;
                  cell.border = border;
                  cell.value = dataList[j];
                }
                row++;
              }
            }
          });
        }
      })
    );
    return { worksheet, row };
  };

  // Function to create a excel sheet and add headers and dowload it.
  const excelExport = (e) => {
    e.preventDefault();
    // Create new Excel file ans name it
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("Exam Schedule");
    let sheetHeaders = [
      ...headers,
      `Academic Year (${academicYear}) ${semesterGroup} SEMESTERS`,
      `${expType}`,
    ];
    let cols = [
      ["B", "C"],
      ["D", "H"],
      ["I", "J"],
      ["K", "L"],
      ["M", "O"],
    ];
    let titles = ["Subject Code", "Subject Name", "Date", "Day", "Time"];

    // Add header to the worksheet
    for (let i = 1; i <= 15; i++) {
      if (i <= sheetHeaders.length) {
        worksheet.mergeCells(`B${i}:O${i}`);
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

    // Add semester wise exam schedule to worksheet
    for (
      let i = semesterGroup === "Even" ? 2 : 1, row = sheetHeaders.length + 2;
      i <= 8;
      i += 2
    ) {
      let examSchedule = examSchedules.filter(
        (examSchedule) => examSchedule.semester === i
      );
      if (examSchedule.length === 1) {
        //
        worksheet.mergeCells(`B${row}:O${row}`);
        let cell = worksheet.getCell(`B${row}`);
        cell.fill = subHeader2Fill;
        cell.border = border;
        cell.value = `Semester: ${i}`;
        row++;
        const x = addExamSchedule(
          pedagogies.filter((pedagogy) => pedagogy.semester === i),
          examSchedule,
          worksheet,
          row,
          cols
        );
        worksheet = x.worksheet;
        row = x.row;
      }
    }

    // Create excel file from the create worksheet and save it
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `${expType} Scheule(${academicYear}).xlsx`
      );
    });
  };

  // Redirect to ExamSchedule.js if exportType, institute, degree, academicyear /
  // or semestergroup is null else render the proper headers and exam schedules
  return expType && institute && degree && academicYear && semesterGroup ? (
    <div className="row py-3" style={{ lineHeight: 1.15 }}>
      <div className="col-md">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <p className="h2 text-center">
              <u style={{ letterSpacing: "0.0325em" }}>EXAM SCHEDULE</u>
            </p>
            <button
              type="button"
              className="btn btn-light float-right"
              onClick={(e) => excelExport(e)}
            >
              Export Data <i className="fa fa-download"></i>
            </button>
          </div>
          <div className="card-body ">
            <div className="row pb-3">
              <div className="col-md text-center">
                <p className="h3">
                  <u>Charotar University of Science and Technology, Changa</u>
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <p className="h5">Institute: {institute} </p>
              </div>
            </div>
            <div className="row p-3">
              <div className="col-md-6 text-center">
                <p className="h5">Degree: {degree} </p>
                <p className="h5">Academic Year: {academicYear}</p>
              </div>
              <div className="col-md-6 text-center">
                <p className="h5">Semester Group: {semesterGroup}</p>
                <p className="h5">Test: {expType}</p>
              </div>
            </div>
            <div className="row mx-1 overflow-auto">
              <table className="table table-striped">
                {expType &&
                  pedagogies &&
                  examSchedules &&
                  renderSchedulesSemester()}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/examSchedule" />
  );
}

export default DataExport;

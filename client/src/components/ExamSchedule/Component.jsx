import moment from "moment";
import React, { Fragment } from "react";

// Reusable component that returns examfrom and examto components
const Component = ({
  newSubject = true,
  index,
  subjectName,
  onSubjectNameChange,
  examWeekFrom,
  examWeekTo,
  examFrom,
  examTo,
  onToDateChange,
  onFromDateChange,
}) => {
  return (
    <Fragment>
      <div className="row">
        <div className="col-md">
          <div className="form-group">
            {!newSubject && <p className="h5 m-1"> Subject: {subjectName}</p>}
            {newSubject && (
              <Fragment>
                <label>Subject: </label>
                <input
                  id={index + "-subjectName"}
                  className="form-control"
                  placeholder="New Subject Code and Name"
                  pattern="^([A-Z][A-Z][0-9][0-9][0-9])[ ]([a-zA-Z ]+)$"
                  title="Example: CE-123 SubjectName"
                  required
                  value={subjectName}
                  onChange={(e) => {
                    onSubjectNameChange(e);
                  }}
                />
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <label>From:</label>
            <input
              id={index + "-from"}
              type="datetime-local"
              className="form-control"
              value={
                examFrom ? moment(examFrom).format("YYYY-MM-DDTHH:mm:ss") : ""
              }
              min={moment(examWeekFrom).format("yyyy-MM-DD") + "T00:00:00"}
              max={moment(examWeekTo).format("yyyy-MM-DD") + "T00:00:00"}
              onChange={(e) => {
                onFromDateChange(e);
              }}
              required
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="form-group">
            <label>To:</label>
            <input
              id={index + "-to"}
              type="datetime-local"
              className="form-control"
              value={examTo ? moment(examTo).format("YYYY-MM-DDTHH:mm:ss") : ""}
              min={moment(examWeekFrom).format("yyyy-MM-DD") + "T00:00:00"}
              max={moment(examWeekTo).format("yyyy-MM-DD") + "T00:00:00"}
              onChange={(e) => {
                onToDateChange(e);
              }}
              required
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Component;

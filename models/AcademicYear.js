const mongoose = require("mongoose");

// Academic Year schema containing year, degreeId (Foreign Key), semesterNo,
// subjectId (Foreign Key), createdUserID(Foreign Key), recStatus, modifiedUserID
// (Foreign Key) and timeStamps for created and modified time
const AcademicYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblinstitutedegrees",
      required: true,
    },
    semesters: [
      {
        semesterNo: {
          type: Number,
          required: true,
        },
        subjects: [
          {
            subjectId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "tblsubjects",
            },
          },
        ],
      },
    ],
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbladmins",
    },
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbladmins",
    },
    recStatus: {
      type: String,
      default: "A",
    },
  },
  // Creates timestamps for record created and when it is modified
  { timestamps: true }
);

// Export the schema with table name tblAcademicYear
module.exports = AcademicYear = mongoose.model(
  "tblacademicYear",
  AcademicYearSchema
);

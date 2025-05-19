const mongoose = require("mongoose");

// ExamSchedule Schema containing academicYear(Foreign Key), semesterNo,
// testName, examWeekFrom, examWeekTo, subjectId (Foreign Key), from, to,
// (Foreign Key)
const ExamScheduleSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblacademicyears",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    examWeekFrom: {
      type: String,
      required: true,
    },
    examWeekTo: {
      type: String,
      required: true,
    },
    schedule: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tblsubjects",
        },
        from: {
          type: String,
          required: true,
        },
        to: {
          type: String,
          required: true,
        },
      },
    ],
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblusers",
    },
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblusers",
    },
    recStatus: {
      type: String,
      default: "A",
    },
  },
  // Creates timestamps for record created and when it is modified
  { timestamps: true }
);

// Export the schema with table name tblExamSchedule
module.exports = ExamSchedule = mongoose.model(
  "tblExamSchedule",
  ExamScheduleSchema
);

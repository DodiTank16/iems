const mongoose = require("mongoose");

const NotEligibilitySchema = new mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblsubjects",
    },
    componentName: {
      type: String,
      required: true,
    },
    neStudents: [
      {
        studentId: {
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
  {
    timestamps: true,
  }
);

module.exports = NotEligibility = mongoose.model(
  "tblNotEligibleStudents",
  NotEligibilitySchema
);

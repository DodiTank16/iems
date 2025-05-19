const mongoose = require("mongoose");

// Seating arrangement contains foreign keys like :
//      academicYear,
//      instituteId,
//      degreeId
//      subjectId
// and also contains other fields like:
//      semester,
//      testname,

const SeatingArrangementSchema = mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblacademicyears",
      required: true,
    },

    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblinstitutedegrees",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblsubjects",
    },
    testName: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    // arrangements is an array which contains:
    //      resourceId(foriegn key)
    //      fromStudentId
    //      toStudentId
    arrangements: [
      {
        resourceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tblresources",
          required: true,
        },
        fromStudentId: {
          type: String,
          required: true,
        },
        toStudentId: {
          type: String,
          required: true,
        },
      },
    ],

    // The user's id who added this data will be stored
    createdUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblusers",
    },
    // The user's id who modifies this data will be stored
    modifiedUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblusers",
    },
    // If the record is deleted then recStatus will be D otherwise A
    recStatus: {
      type: String,
      default: "A",
    },
  },
  // The time of this data creation will be stored.
  {
    timestamps: true,
  }
);

// Export the schema with table name tblSeatingArrangements
module.exports = SeatingArrangement = mongoose.model(
  "tblSeatingArrangements",
  SeatingArrangementSchema
);

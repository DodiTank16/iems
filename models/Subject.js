const mongoose = require("mongoose");

// Subject Schema containing subjectName, subjectCode, degreeId(Foreign Key),
// createdUserID(Foreign Key), recStatus, modifiedUserID(Foreign Key) and
// timeStamps for created and modified time
const SubjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblinstitutedegrees",
      required: true,
    },
  },
  // Creates timestamps for record created and when it is modified
  { timestamps: true }
);

// Export the schema with table name tblSubjects
module.exports = Subject = mongoose.model("tblsubjects", SubjectSchema);

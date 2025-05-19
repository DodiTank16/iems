const mongoose = require("mongoose");

// InstituteDegree schema containing instituteName, degreeName, createdUserID
// (Foreign Key), recStatus, modifiedUserID(Foreign Key) and timeStamps for
// created and modified time
const InstituteDegreeSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: true,
    },
    degrees: [
      {
        degreeName: { type: String, required: true },
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

// Export the schema with table name tblInstituteDegree
module.exports = InstituteDegree = mongoose.model(
  "tblinstitutedegrees",
  InstituteDegreeSchema
);

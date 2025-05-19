const mongoose = require("mongoose");

// Resources contains foreign keys like :
//      academicYear,
//      instituteId,
//      degreeId.
// and also contains other field semester.

const ResourcesSchema = mongoose.Schema(
  {
    degreeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblinstitutedegrees ",
      required: true,
    },
    // classes is an array which contains:
    //      classCode
    //      classNormalLimit
    //      classExamLimit

    classes: [
      {
        code: {
          type: String,
          required: true,
        },
        normalCapacity: {
          type: Number,
          required: true,
        },
        examCapacity: {
          type: Number,
          required: true,
        },
      },
    ],
    // labs is an array which contains:
    //      labCode
    //      labNormalLimit
    //      labExamLimit
    labs: [
      {
        code: {
          type: String,
          required: true,
        },
        normalCapacity: {
          type: Number,
          required: true,
        },
        examCapacity: {
          type: Number,
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

// Export the schema with table name tblResources
module.exports = Resources = mongoose.model("tblResources", ResourcesSchema);

const mongoose = require("mongoose");

// User Schema containing name, email, password, createdUserID(Foreign Key),
// recStatus, modifiedUserID(Foreign Key) and timeStamps for created and
// modified time
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
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

// Export the schema with table name tblUsers
module.exports = User = mongoose.model("tblusers", UserSchema);

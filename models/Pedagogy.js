const mongoose = require("mongoose");

// Pedagogy Schema containing subject(Foregin Key), academicYear(Foregin Key),
// semester, name, mode, component, createdUserID(Foreign Key), recStatus,
// modifiedUserID(Foreign Key) and timeStamps for created and modified time
const PedagogySchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblsubjects",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblacademicyears",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    components: [
      {
        name: {
          type: String,
          required: true,
        },
        mode: {
          type: String,
          required: true,
        },
        weightAge: {
          type: String,
          required: true,
        },
      },
    ],
  },
  // Creates timestamps for record created and when it is modified
  { timestamps: true }
);

// Export the schema with table name tblPedagogies
module.exports = Pedagody = mongoose.model("tblpedagogies", PedagogySchema);

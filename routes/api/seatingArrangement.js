const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
// Models
const SeatingArrangement = require("../../models/SeatingArrangement");
const AcademicYear = require("../../models/AcademicYear");
const InstituteDegree = require("../../models/InstituteDegree");
const Subject = require("../../models/Subject");

// @router POST api/seating-arrangement
// @desc Add new seating arrangement
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    check("academicYear", "Academic year is required.").notEmpty(),
    check("degreeId", "Degree is required.").notEmpty(),
    check("subjectId", "Subject is required.").notEmpty(),
    check("semester", "Semester is required.").notEmpty(),
    check("arrangements", "Arrangements are required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring the academic academicYear,degreeId,semester,classes,labs from req.body
    const {
      academicYear,
      degreeId,
      subjectId,
      semester,
      testName,
      arrangements,
    } = req.body;

    try {
      // Find the resources with academicYear, degreeId, semester
      let seatingArrangement = await SeatingArrangement.findOne({
        academicYear,
        degreeId,
        semester,
        subjectId,
        testName,
      });
      // If it exists then just add the classes and labs to the resource.
      if (seatingArrangement) {
        seatingArrangement.arrangements = arrangements;
        seatingArrangement.modifiedUserID = req.user.id;
      }
      // If it doesn't exist then just add the seatingArrangement with all other fields.
      else {
        let academicYearExist = await AcademicYear.findById(academicYear);

        let degreeExist = await InstituteDegree.findOne({
          degrees: { $elemMatch: { _id: degreeId } },
        });
        let subjectExist = await Subject.findById(subjectId);

        if (!subjectExist) {
          return res.status(400).send("Subject Id is not valid.");
        }

        if (!academicYearExist) {
          return res.status(400).send("Academic Year Id is not valid.");
        }

        if (!degreeExist) {
          return res.status(400).send("Degree Id is not valid.");
        }

        seatingArrangement = new SeatingArrangement({
          academicYear,
          degreeId,
          subjectId,
          testName,
          semester,
          arrangements,
        });
      }
      // Save the seatingArrangement to the database.
      await seatingArrangement.save();
      // Return the the response.
      res.json({ msg: "Seating arrangement added.", seatingArrangement });
    } catch (error) {
      // If the error exists then return response.
      //
      return res.status(500).send("Server error.");
    }
  }
);

module.exports = router;

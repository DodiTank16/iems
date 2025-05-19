const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Subject = require("../../models/Subject");
const InstituteDegree = require("../../models/InstituteDegree");
const auth = require("../../middleware/auth");

// @router POST api/subject
// @desc Add new Subjects
// @access PRIVATE
router.post(
  "/",
  // Check if subjectName, subjectCode and degreeId is supplied
  [
    auth,
    check("subjectName", "Name of subject is required.").notEmpty(),
    check("subjectCode", "Code of subject is required.").notEmpty(),
    check("degreeId", "DegreeID  is required.").notEmpty(),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure subjectName, subjectCode, and degreeId from req.body
    const { subjectName, subjectCode, degreeId } = req.body;

    // Return error if degreeId is not 24 characters long
    if (degreeId.length != 24) {
      return res
        .status(400)
        .json({ errors: "Invalid degreeId No degree found" });
    }

    // Try all the mongoDb operations
    try {
      // Return error if specified degree does not exists
      let instDeg = await InstituteDegree.find({
        degrees: { $elemMatch: { _id: degreeId } },
      });
      if (!instDeg) {
        return res
          .status(400)
          .json({ errors: "Invalid degreeId. No degree found" });
      }

      // Return error if subject already exists else add new record
      let subject = await Subject.findOne({ subjectName, subjectCode });
      if (subject) {
        return res
          .status(400)
          .json({ errors: "Subject record already exists." });
      }
      subject = new Subject({
        subjectName,
        subjectCode,
        degreeId,
      });
      await subject.save();
      res.json({ msg: "Subject added.", subject });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      //
      return res.status(500).send("Server Error.");
    }
  }
);

// @router GET api/subject/?id&?subjectName&?subjectCode&?degreeId
// @desc Get Subjects based on ids or subjectName or subjectCode
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    //  Find and return a record if subjectId exists and is 24 characters long else return error
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid SubjectID. No subject found." }] });
      }
      let subject = await Subject.findById(req.query.id);
      if (!subject) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Record with this id does not exist." }] });
      }
      res.json(subject);
    } else if (req.query.subjectName) {
      //  Find and return a record if subjectName exists else return error
      let subject = await Subject.findOne({
        subjectName: req.query.subjectName,
      });
      if (!subject)
        return res
          .status(400)
          .json({ errors: [{ msg: "Subject does not exists." }] });
      res.json(subject);
    } else if (req.query.subjectCode) {
      //  Find and return a record if subjectCode exists else return error
      let subject = await Subject.findOne({
        subjectCode: req.query.subjectCode,
      });
      if (!subject)
        return res.status(400).json({
          errors: [{ msg: "Subject with this code does not exists." }],
        });
      res.json(subject);
    } else if (req.query.degreeId) {
      //  Find and return a record if degreeId exists and is 24 characters long else return error
      if (req.query.degreeId.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid degreeId. No subjects found." }] });
      }
      let subjects = await Subject.find({
        degreeId: req.query.degreeId,
      });
      if (subjects.length == 0)
        return res.status(400).json({
          errors: [
            { msg: "Subjects that belong to this degreeId does not exists." },
          ],
        });
      res.json(subjects);
    } else if (Object.keys(req.query).length == 0) {
      // If no queries is passed return all the records
      let subjects = await Subject.find({});
      return res.json(subjects);
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    console.error(err.message);
    return res.status(500).send("Server Error.");
  }
});

// @router POST api/subject
// @desc Add new Subjects
// @access PRIVATE
router.delete("/:subjectId", [auth], async (req, res) => {
  try {
    await Subject.remove({ _id: req.params.subjectId });
    res.json({ msg: "Subject Deleted" });
  } catch (error) {
    res.json({ msg: "Server error occured" });
  }
});

module.exports = router;

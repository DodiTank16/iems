const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Pedagogy = require("../../models/Pedagogy");
const Subject = require("../../models/Subject");
const ExamSchedule = require("../../models/ExamSchedule");

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access PRIVATE
router.post(
  "/",
  // Check if subjectId, semester, academicYear and componemts of minimum length 1 is passed
  [
    auth,
    check("subject", "Id of subject is required").notEmpty(),
    check("semester", "Semester number is required").notEmpty(),
    check("academicYear", "Id of Academic Year is required").notEmpty(),
    check("components", "Components are required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure subject, components, semester, and academicYear from req.body
    const { subject, components, semester, academicYear } = req.body;

    // Try all the mongoDb operations
    try {
      // Find a subject record if length of subjectId is equal to 24
      if (subject.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid subjectId. No subject found" }] });
      }
      let subjectOb = await Subject.findById(subject);
      if (!subjectOb) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid subject. No subject found" }] });
      }
      // Update components if record already exists for subjectId else add new record
      let pedagogy = await Pedagogy.findOne({ subject: subject });
      if (pedagogy) {
        let examComponents = pedagogy.components.filter(
          (component) =>
            component.name === "Unit Test 1" || component.name === "Unit Test 2"
        );
        examComponents.forEach(async (component) => {
          if (
            components.find((comp) => comp.name === component.name) ===
            undefined
          ) {
            let examSchedule = await ExamSchedule.findOne({
              semester,
              academicYear,
              recStatus: "A",
            });
            examSchedule.schedule = examSchedule.schedule.filter(
              (schedule) => schedule.subjectId !== subject
            );
            await examSchedule.save();
          }
        });
        pedagogy.components = components;
      } else {
        pedagogy = new Pedagogy({
          academicYear,
          semester,
          subject,
          components,
        });
      }
      await pedagogy.save();
      res.json({ msg: "Pedagogy added.", pedagogy });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      //
      return res.status(500).send("Server Error.");
    }
  }
);

// @router GET api/pedagogy/?subjectId&?semesterNo&?semesterGroup&?academicYear
// @desc Get pedagogy
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    // Find and return a record if id exists and it is of length 24
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Id. No record found" }] });
      }
      let pedagogy = await Pedagogy.findById(req.query.id);
      if (!pedagogy) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Record with this id does not exist." }] });
      }
      return res.json(pedagogy);
    } else if (req.query.academicYear) {
      // Return error if academicYearId does not 24 characters
      if (req.query.academicYear.length != 24) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Academic Year Id. No record found" }],
        });
      }

      // Find and return pedagogies for specified semesterNo if it exists
      if (req.query.semesterNo) {
        let pedagogies = await Pedagogy.find({
          semester: req.query.semesterNo,
          academicYear: req.query.academicYear,
        }).populate("subject", ["subjectCode", "subjectName"]);

        if (pedagogies.length === 0) {
          return res.status(400).json({
            errors: [
              { msg: "Records with this semester number does not exist." },
            ],
          });
        }
        return res.json(pedagogies);
      } else if (req.query.semesterGroup) {
        // Find all the records with semester belong to specified semesterGroup
        let semesters = [];

        if (req.query.semesterGroup === "Even")
          semesters = ["2", "4", "6", "8"];
        else semesters = ["1", "3", "5", "7"];

        let pedagogies = await Pedagogy.find({
          academicYear: req.query.academicYear,
          semester: { $in: semesters },
        }).populate("subject", ["subjectCode", "subjectName"]);

        if (pedagogies.length === 0) {
          return res.status(400).json({
            errors: [
              { msg: "Record with this academicYear id does not exist." },
            ],
          });
        }
        return res.json(pedagogies);
      } else {
        // Find all the pedagogies that belong to specified academicYear
        let pedagogies = await Pedagogy.find({
          academicYear: req.query.academicYear,
        }).populate("subject", ["subjectCode", "subjectName"]);

        if (pedagogies.length === 0) {
          return res.status(400).json({
            errors: [
              { msg: "Record with this academicYear id does not exist." },
            ],
          });
        }
        return res.json(pedagogies);
      }
    } else if (req.query.subjectId && req.query.subjectId.length === 24) {
      // Find pedagogoy belong to specified subjectId if it exists and is of length 24 characters
      let pedagogy = await Pedagogy.findOne({
        subject: req.query.subjectId,
      });
      if (!pedagogy)
        return res.status(400).json({
          errors: [{ msg: "Pedagogy for this subject does not exists." }],
        });
      return res.json(pedagogy);
    } else if (Object.keys(req.query).length == 0) {
      // If no arguments are passed return all the records
      let pedagogies = await Pedagogy.find({}).populate("subject");
      return res.json(pedagogies);
    } else {
      res.status(400).send("Bad request");
    }
  } catch (e) {
    // Catch any error that occurs due to mongoDb operations
    //
    return res.status(500).send("Server Error.");
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const NotEligible = require("../../models/NotEligibility");

// @router POST api/not-eligible
// @desc Add new not eligible students
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    check("academicYear", "Academic Year is required").notEmpty(),
    check("semester", "Semester is required").notEmpty(),
    check("subject", "Subject is required").notEmpty(),
    check("componentName", "Component Name is required").notEmpty(),
    check("neStudents", "Students is required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      academicYear,
      semester,
      subject,
      componentName,
      neStudents,
    } = req.body;

    try {
      let ne = await NotEligible.findOne({
        academicYear: academicYear,
        semester: semester,
        subject: subject,
        componentName: componentName,
      });
      if (ne) {
        ne.modifiedUserID = req.user.id;
        ne.neStudents = neStudents;
      } else {
        ne = new NotEligible({
          modifiedUserID: req.user.id,
          createdUserID: req.user.id,
          academicYear,
          semester,
          subject,
          componentName,
          neStudents,
        });
      }

      await ne.save();
      res.json({
        errors: [{ msg: `Not eligible students for ${componentName} added.` }],
      });
    } catch (e) {
      //
      return res.status(500).send("Server Error.");
    }
  }
);

// @router GET api/not-eligible/?academicYear?semester?subject?componentName
// @desc Get not eligible students
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  const { academicYear, subject, semester, componentName } = req.query;
  try {
    if (subject) {
      if (subject.length != 24) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Subject Id. No record found" }],
        });
      }
      if (academicYear && semester && componentName) {
        let ne = await NotEligible.findOne({
          academicYear,
          semester,
          subject,
          componentName,
        });
        if (!ne) {
          return res.status(400).json({
            errors: [
              { msg: "Records with this semester number does not exist." },
            ],
          });
        }
        return res.json(ne.neStudents);
      }
    } else if (academicYear && semester) {
      let ne = await NotEligible.find({
        academicYear,
        semester,
      });
      if (ne.length < 0) {
        return res.status(400).json({
          errors: [
            { msg: "Records with this semester number does not exist." },
          ],
        });
      }
      return res.json(ne);
    }
  } catch (err) {
    //
    return res.status(500).send("Server Error.");
  }
});

module.exports = router;

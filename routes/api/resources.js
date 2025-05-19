const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
// Models
const Resources = require("../../models/Resources");
const AcademicYear = require("../../models/AcademicYear");
const InstituteDegree = require("../../models/InstituteDegree");

// @router POST api/resources
// @desc Add new resources
// @access PRIVATE
router.post(
  "/",
  [
    auth,
    // check('academicYear', 'Academic year is required.').notEmpty(),
    check("degreeId", "Degree is required.").notEmpty(),
    // check('semester', 'Semester is required.').notEmpty(),
    // check("classes", "Classes are required").isArray({ min: 1 }),
    // check("labs", "Labs are required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring the academic academicYear,degreeId,semester,classes,labs from req.body
    // const { academicYear, degreeId, semester, classes, labs } = req.body;
    const { degreeId, classes, labs } = req.body;

    try {
      // Find the resources with academicYear, degreeId, semester
      let resources = await Resources.findOne({
        // academicYear,
        degreeId,
        // semester,
      });
      // If it exists then just add the classes and labs to the resource.
      if (resources) {
        resources.classes = classes;
        resources.labs = labs;
        resources.modifiedUserID = req.admin.id;
      }
      // If it doesn't exist then just add the resources with all other fields.
      else {
        let degreeExist = await InstituteDegree.findOne({
          degrees: { $elemMatch: { _id: degreeId } },
        });

        if (!degreeExist) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Degree Id is not valid." }] });
        }

        resources = new Resources({
          degreeId,
          classes,
          labs,
          createdUserID: req.admin.id,
          modifiedUserID: req.admin.id,
        });
      }
      // Save the resources to the database.
      await resources.save();
      // Return the the response.
      res.json({ msg: "Resources added.", resources });
    } catch (error) {
      // If the error exists then return response.
      //
      return res.status(500).send("Server error.");
    }
  }
);

// @router GET api/resources/?academicYear&?semesterNo&?instituteId&?degreeId
// @desc Get resources
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    // Find and return a record if id exists and it is of length 24
    if (req.query.degreeId) {
      // Return error if academicYearId, instituteId and degreeId does not 24 characters
      if (req.query.degreeId.length != 24) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Degree Id. No record found" }],
        });
      }

      let resources = await Resources.findOne({
        degreeId: req.query.degreeId,
      });
      if (!resources) {
        return res.status(400).json({
          errors: [
            { msg: "Records with this semester number does not exist." },
          ],
        });
      }
      return res.json(resources);
    } else if (Object.keys(req.query).length == 0) {
      // If no arguments are passed return all the records
      //
      let resources = await Resources.find({});
      return res.json(resources);
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

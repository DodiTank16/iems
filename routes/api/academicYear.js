const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const AcademicYear = require("../../models/AcademicYear");
const auth = require("../../middleware/auth");

// @router POST api/academic-year
// @desc Add new academic year
// @access PRIVATE
router.post(
  "/",
  // Check if academicYear and degreeId is supplied and semesters array is of size 8
  [
    auth,
    check("year", "Academic Year is required.").notEmpty(),
    check("degreeId", "DegreeId is required.").notEmpty(),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure year, degreeId and semesters from req.body
    const { year, degreeId, semesters } = req.body;

    // Return error if length of degreeId is not 24
    if (degreeId.length != 24) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid degreeId. No degree found" }] });
    }

    // Try all the mongoDb operations
    try {
      // Return error if record is not found
      const instDeg = await InstituteDegree.findOne({
        degrees: { $elemMatch: { _id: degreeId } },
      });
      if (!instDeg) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid degreeId. No degree found" }] });
      }
      // Replace the semesters array if the record already exists else add new record for specified year and degree
      let academicYear = await AcademicYear.findOne({ year, degreeId });
      if (academicYear) {
        academicYear.semesters = semesters;
        academicYear.modifiedUserID = req.admin.id;
      } else {
        academicYear = new AcademicYear({
          year,
          degreeId,
          semesters,
          modifiedUserID: req.admin.id,
          createdUserID: req.admin.id,
        });
      }
      await academicYear.save();
      res.json({ msg: "Record added.", academicYear });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      return res.status(500).send("Server Error.");
    }
  }
);

// @router POST api/academic-year/ay
// @desc Add new academic year
// @access PRIVATE

router.post(
  "/ay",
  [
    auth,
    check("year", "Academic Year is required.").notEmpty(),
    check("degreeId", "DegreeId is required.").notEmpty(),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure year, degreeId and semesters from req.body
    const { year, degreeId, semesters } = req.body;
    // Return error if length of degreeId is not 24
    if (degreeId.length != 24) {
      return res.status(400).json({ msg: "Invalid degreeId. No degree found" });
    }

    // Try all the mongoDb operations
    try {
      // Return error if record is not found
      const instDeg = await InstituteDegree.findOne({
        degrees: { $elemMatch: { _id: degreeId } },
      });
      if (!instDeg) {
        return res
          .status(400)
          .json({ msg: "Invalid degreeId. No degree found" });
      }
      // Replace the semesters array if the record already exists else add new record for specified year and degree
      let academicYear = await AcademicYear.findOne({ year, degreeId });
      if (academicYear) {
        academicYear.semesters = semesters;
        academicYear.modifiedUserID = req.admin.id;
      } else {
        academicYear = new AcademicYear({
          year,
          degreeId,
          semesters,
          modifiedUserID: req.admin.id,
          createdUserID: req.admin.id,
        });
      }
      await academicYear.save();
      res.json({ msg: "Record added.", academicYear });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations

      return res.status(500).send("Server Error.");
    }
  }
);

// @router POST api/academic-year/subject
// @desc Add subjects
// @access PRIVATE

router.post(
  "/ay/subject/:sem",
  [
    auth,
    check("year", "Academic Year is required.").notEmpty(),
    check("degreeId", "DegreeId is required.").notEmpty(),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure year, degreeId and semesters from req.body
    const { year, degreeId, subjects } = req.body;
    // Return error if length of degreeId is not 24
    if (degreeId.length != 24) {
      return res.status(400).json({ msg: "Invalid degreeId. No degree found" });
    }

    // Try all the mongoDb operations
    try {
      // Return error if record is not found
      const instDeg = await InstituteDegree.findOne({
        degrees: { $elemMatch: { _id: degreeId } },
      });
      if (!instDeg) {
        return res
          .status(400)
          .json({ msg: "Invalid degreeId. No degree found" });
      }
      // Replace the semesters array if the record already exists else add new record for specified year and degree
      await AcademicYear.update(
        { year, degreeId, "semesters.semesterNo": req.params.sem },
        {
          $set: {
            "semesters.$.subjects": subjects,
          },
        }
      );
      res.json({ msg: "Subjects Updated" });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      console.error(err.message);
      return res.status(500).send("Server Error.");
    }
  }
);

// @router PUT api/academic-year/ay
// @desc Update academic year
// @access PRIVATE
router.put("/:ayid", [auth], async (req, res) => {
  // Destructure year from request body
  const { year } = req.body;

  // Try all the mongoDb operations
  try {
    // Update new academic year to the end if it already does not exists
    let ay = await AcademicYear.findById(req.params.ayid);
    if (!ay) {
      return res.status(400).json({
        errors: [{ msg: "Academic year with this Id does not exists." }],
      });
    }
    ay.year = year;
    await ay.save();
    res.json(ay);
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    console.error(err.message);
    return res.status(500).send("Server Error.");
  }
});

// @router DELETE api/academic-year/:ayid
// @desc Delete academic year
// @access PRIVATE
router.delete("/:ayid", [auth], async (req, res) => {
  try {
    await AcademicYear.remove({ _id: req.params.ayid });
    res.json({ msg: "AcademicYear Deleted" });
  } catch (error) {
    res.json({ msg: "Server error occured" });
  }
});

// @router GET api/academic-year/?id&?year&?semesterNo&?degreeId
// @desc Add new academic year
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    // Find record based on id
    if (req.query.id) {
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Id. No record found" }] });
      }
      const academicYear = await AcademicYear.findById(req.query.id);
      if (!academicYear) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Id. No record found" }] });
      }
      return res.json(academicYear);
    } else if (req.query.year) {
      // Find record based on year specified
      const academicYear = await AcademicYear.findOne({ year: req.query.year });
      if (!academicYear) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Record for this year does not exists." }] });
      }
      // if semesterNo is also passed filter and send data for that semester
      if (req.query.semesterNo) {
        let year = academicYear;
        year.semesters = academicYear.semesters.filter(
          (sem) => sem.semesterNo == req.query.semesterNo
        );
        if (!year.semesters.length == 0) {
          return res.status(400).json({
            errors: [{ msg: "This semester does not belon to this year." }],
          });
        }
        return res.json(year);
      }
      return res.json(academicYear);
    } else if (req.query.degreeId) {
      // Find all the records belonging to specified degreeId and populate subjects data from tblSubjects
      const academicYears = await AcademicYear.find({
        degreeId: req.query.degreeId,
      })
        .populate({
          path: "semesters",
          populate: {
            path: "subjects",
            populate: {
              path: "subjectId",
              select: ["subjectCode", "subjectName"],
            },
          },
        })
        .sort({ year: -1 });
      if (academicYears.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid degreeId. No record found" }] });
      }
      return res.json(academicYears);
    } else if (Object.keys(req.query).length == 0) {
      // If no argument is passed return all the records from the table
      const years = await AcademicYear.find().select("year");
      return res.json(years);
    } else {
      return res.status(500).send("Bad request.");
    }
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    //
    return res.status(500).send("Server Error.");
  }
});

// @router GET api/academic-year/degree
// @desc Get academic year according to degree
// @access PRIVATE
router.get("/degree/:id", auth, async (req, res) => {
  const degreeId = req.params.id;
  //
  try {
    if (degreeId) {
      // Find all the records belonging to specified degreeId and populate subjects data from tblSubjects
      const academicYears = await AcademicYear.find({
        degreeId: degreeId,
      })
        .populate({
          path: "semesters",
          populate: {
            path: "subjects",
            populate: {
              path: "subjectId",
              select: ["subjectCode", "subjectName"],
            },
          },
        })
        .sort({ year: -1 });

      if (academicYears.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid degreeId. No record found" }] });
      }
      return res.json(academicYears);
    }
  } catch (error) {
    // Catch any error that occurs due to mongoDb operations
    //
    return res.status(500).send("Server Error.");
  }
});

module.exports = router;

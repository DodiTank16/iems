const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const ExamSchedule = require("../../models/ExamSchedule");

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access PRIVATE
router.post(
  "/",
  [
    // Check if academicYear, testName, examWeekFrom, examWeekTo and semester is passed and minimum 1 schedule is passed
    auth,
    check("academicYear", "Academic Year is required.").notEmpty(),
    check("testName", "Test name is required.").notEmpty(),
    check("examWeekFrom", "Starting date of exam week is required.").notEmpty(),
    check("examWeekTo", "Ending date of exam week is required.").notEmpty(),
    check("semester", "Semester is required").notEmpty(),
    check("schedule", "Schedule is required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure academicYear, semester, schedule, testName, examWeekFrom and examWeekTo from req.body
    const {
      academicYear,
      semester,
      schedule,
      testName,
      examWeekFrom,
      examWeekTo,
    } = req.body;

    // Try all the mongoDb operations
    try {
      // Add new if record already exists else modify the record
      let examschedule = await ExamSchedule.findOne({
        academicYear: academicYear,
        semester: semester,
        testName: testName,
      });
      if (examschedule) {
        examschedule.schedule = schedule;
        examschedule.modifiedUserID = req.user.id;
        examschedule.examWeekFrom = examWeekFrom;
        examschedule.examWeekTo = examWeekTo;
      } else {
        examschedule = new ExamSchedule({
          modifiedUserID: req.user.id,
          createdUserID: req.user.id,
          academicYear,
          semester,
          schedule,
          examWeekFrom,
          examWeekTo,
          testName,
        });
      }
      await examschedule.save();
      res.json({ msg: "Exam Schedule added", examschedule });
    } catch (e) {
      // Catch any error that occurs due to mongoDb operations
      //
      return res.status(500).send("Server Error.");
    }
  }
);

// @router POST api/pedagogy/?semesterNo&?academicYear&?semesterGroup
// @desc Add new pedagogy
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    if (req.query.academicYear) {
      // Return error if academicYear id is not 24 characters long
      if (req.query.academicYear.length != 24) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Academic Year Id. No record found" }],
        });
      }
      // Find record and populate subject Name and Code and then return if semesterNo and testName is supplied
      if (req.query.semesterNo && req.query.testName) {
        let schedules = await ExamSchedule.findOne({
          semester: req.query.semesterNo,
          academicYear: req.query.academicYear,
          testName: req.query.testName,
        }).populate({
          path: "schedule",
          populate: {
            path: "subjectId",
            select: ["subjectCode", "subjectName"],
          },
        });

        if (!schedules) {
          return res.status(400).json({
            errors: [
              { msg: "Records with this semester number does not exist." },
            ],
          });
        }
        return res.json(schedules);
      } else if (req.query.semesterGroup && req.query.testName) {
        // Find record and populate subject Name and Code and then return if semesterGroup and testName is supplied
        let semesters = [];

        if (req.query.semesterGroup === "Even")
          semesters = ["2", "4", "6", "8"];
        else semesters = ["1", "3", "5", "7"];

        schedules = await ExamSchedule.find({
          semester: { $in: semesters },
          academicYear: req.query.academicYear,
          testName: req.query.testName,
        }).populate({
          path: "schedule",
          populate: {
            path: "subjectId",
            select: ["subjectCode", "subjectName"],
          },
        });

        if (schedules.length <= 0) {
          return res.status(400).json({
            errors: [
              { msg: "Records with this semester number does not exist." },
            ],
          });
        }
        return res.json(schedules);
      }
    }
  } catch (e) {
    // Catch any error that occurs due to mongoDb operations
    //
    return res.status(500).send("Server Error.");
  }
});

module.exports = router;

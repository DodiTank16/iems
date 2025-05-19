const { request } = require("express");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const InstituteDegree = require("../../models/InstituteDegree");
const _ = require("lodash");
// @router POST api/institute
// @desc Add new Degree
// @access PRIVATE
router.post(
  "/",
  // Check if minimum 1 degree and name of institute is supplied
  [
    auth,
    check("instituteName", "Institute name is required.").notEmpty(),
    check("degrees", "Degrees are required.").isArray({ min: 1 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure instituteName and degrees from req.body
    const { instituteName, degrees } = req.body;
    //
    // Try all the mongoDb operations
    try {
      // If record does not exists add a new record
      let institute = await InstituteDegree.findOne({ instituteName });
      if (institute) {
        // console.log("i=>", institute.degrees);
        // const data = _.difference(degrees, institute.degrees);
        // console.log("data=>", data);
        degrees.forEach((e) => {
          institute.degrees.push(e);
        });
        institute.modifiedUserID = req.admin.id;
      } else {
        institute = new InstituteDegree({
          instituteName,
          degrees,
          modifiedUserID: req.admin.id,
          createdUserID: req.admin.id,
        });
      }
      await institute.save();
      res.json({ msg: "Record added.", institute });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      console.error(err.message);
      return res.status(500).send("Server Error.");
    }
  }
);

// @router POST api/institute/name
// @desc Add the institute Name
// @access PRIVATE
router.post(
  "/name",
  [auth, check("instituteName", "Institute name is required.").notEmpty()],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { instituteName } = req.body;
    // Try all the mongoDb operations
    try {
      // If record does not exists add a new record
      let institute = await InstituteDegree.findOne({ instituteName });
      if (institute) {
        return res.status(400).send("Institute already exists.");
      } else {
        institute = new InstituteDegree({
          instituteName,
          modifiedUserID: req.admin.id,
          createdUserID: req.admin.id,
        });
      }
      await institute.save();
      res.json({ msg: "Record added.", institute });
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      console.error(err.message);
      return res.status(500).send("Server Error.");
    }
  }
);

// @router GET api/institute/?id&?instituteName&?degreeName
// @desc Get institutes and degrees based on query
// @access PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    if (req.query.id) {
      // Find record based on the id if the length of passed id is equal to 24
      if (req.query.id.length != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Id. No record found" }] });
      }
      let institute = await InstituteDegree.findById(req.query.id);
      if (!institute) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Record with this id does not exist." }] });
      }
      return res.json(institute);
    } else if (req.query.instituteName) {
      // Find record if instituteName is passed
      let institute = await InstituteDegree.findOne({
        instituteName: req.query.instituteName,
      });
      if (!institute) {
        return res.status(400).json({
          errors: [{ msg: "Institute with this name does not exists." }],
        });
      }
      // Filter records with degreeName if degreeName is also passed
      if (req.query.degreeName) {
        let inst = institute;
        inst.degrees = institute.degrees.filter(
          (degree) => degree.degreeName == req.query.degreeName
        );
        if (inst.degrees.length == 0) {
          return res.status(400).json({
            errors: [{ msg: "This degree does not belong to this institute." }],
          });
        }
        return res.json(inst);
      }
      return res.json(institute);
    } else if (Object.keys(req.query).length == 0) {
      // If no queries is passed return all the records
      let institutes = await InstituteDegree.find({}).sort({
        instituteName: 1,
      });
      res.json(institutes);
    } else {
      res.status(400).send("Bad request");
    }
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    //
    return res.status(500).send("Server Error.");
  }
});

// @router PUT api/institute/:instituteId
// @desc Change the institute Name
// @access PRIVATE
router.put(
  "/:instituteId",
  // Check if atleast one degree is passed
  auth,
  async (req, res) => {
    // Destructure instituteName from req.body
    const { instituteName } = req.body;

    // Try all the mongoDb operations
    try {
      // Add new degrees to the end if it already does not exists
      let institute = await InstituteDegree.findById(req.params.instituteId);
      if (!institute) {
        return res.status(400).json({
          errors: [{ msg: "Institute with this Id does not exists." }],
        });
      }
      institute.instituteName = instituteName;
      await institute.save();
      res.json(institute);
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      console.error(err.message);
      return res.status(500).send("Server Error.");
    }
  }
);

// @router DELETE api/institute/:instituteId
// @desc Delete the institute
// @access PRIVATE
router.delete("/:instituteId", [auth], async (req, res) => {
  try {
    await InstituteDegree.remove({ _id: req.params.instituteId });
    res.json({ msg: "Institute Deleted" });
  } catch (error) {
    res.json({ msg: "Server error occured" });
  }
});

// @router DELETE api/institute/:instituteId
// @desc Delete the institute
// @access PRIVATE
router.delete("/degree/:instituteName/:degreeId", [auth], async (req, res) => {
  try {
    let institute = await InstituteDegree.findOne({
      instituteName: req.params.instituteName,
    });
    const deg = institute.degrees.find((d) => d.id === req.params.degreeId);
    let removeIndex;
    institute.degrees.forEach((f, id) => {
      if (f.id === req.params.degreeId) {
        removeIndex = id;
      }
    });
    institute.degrees.splice(removeIndex, 1);
    await institute.save();
    res.json({ msg: "Degree Deleted" });
  } catch (error) {
    res.json({ msg: "Server error occured" });
  }
});

module.exports = router;

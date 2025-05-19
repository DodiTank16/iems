const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Admin = require("../../models/Admin");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// @router  GET api/adminAuth
// @desc    Retrive single user
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.json(400).json({
        errors: [{ msg: "Admin with this Id does not exists." }],
      });
    }
    res.json(admin);
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    //
  }
});

// @router  POST api/adminAuth
// @desc    Authenticate admin and get token (Login)
// @access  PUBLIC
router.post(
  "/",
  [
    // Check id email is supplied and if password if of valid length
    check("email", "Please include a valid email.").isEmail(),
    check(
      "password",
      "Please enter a password with minimum 6 characters."
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure email and password from req.body
    const { email, password } = req.body;
    // Try all the mongoDb operations
    try {
      // Check if admin exists
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect Credentials." }],
        });
      }
      // Validate Credentails
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect Credentials." }],
        });
      }

      // Create and return jsonwebtoken
      const payload = {
        admin: {
          id: admin.id,
        },
      };

      jwt.sign(
        payload,
        config.get("loginToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // Catch any error that occurs due to mongoDb operations
      //
      return res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;

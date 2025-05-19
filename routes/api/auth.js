const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// @router  GET api/auth
// @desc    Retrive single user
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User with this Id does not exists." }],
      });
    }
    res.json(user);
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    //
  }
});

// @router  POST api/auth
// @desc    Authenticate user and get token (Login)
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
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect Credentials." }],
        });
      }
      // Validate Credentails
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Incorrect Credentials." }],
        });
      }

      // Create and return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
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

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// @router  POST api/users/register
// @desc    Register new users
// @access  PUBLIC
router.post(
  "/register",
  // Check if name, email and password of minimum 6 characters exists
  [
    check("name", "Name is required.").notEmpty(),
    check("email", "Please include a valid email.").isEmail(),
    // check(
    //   'password',
    //   'Please enter a password with minimum 6 characters.'
    // ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // If any argument check fails return the array of errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure name, email and password from req.body
    const { name, email } = req.body;

    // Create the random password for user
    var randomPassword = Math.random().toString(36).slice(-8);

    // Try all the mongoDb operations
    try {
      // Add new record if user does not exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: "User already exists.",
        });
      }
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to IEMS",
        html: `<h1>Welcome to IEMS</h1><h3>Your password : ${randomPassword}</h3>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(400).json({
            errors: "Mail doesn't sent. Please give valid email.",
          });
        }
      });

      user = new User({
        name: name,
        email: email,
        password: randomPassword,
        // createdUserID: req.admin.id,
        // modifiedUserID: req.admin.id,
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(randomPassword, salt);

      // Save user to database
      await user.save();

      res.json({ msg: "User added", user });
    } catch (err) {
      //
      return res.status(500).send("Server Error.");
    }
  }
);

// @router  GET api/users
// @desc    Get all users
// @access  PUBLIC
router.get("/", async (req, res) => {
  // Get all users from db
  try {
    const user = await User.find({}).select("-password");
    res.json(user);
  } catch (error) {
    //
  }
});

// @router  DELETE api/users/:uid
// @desc    Delete user
// @access  PUBLIC
router.delete("/:uid", async (req, res) => {
  try {
    await User.remove({ _id: req.params.uid });
    res.json({ msg: "User Deleted" });
  } catch (error) {
    res.json({ msg: "Server error occured" });
  }
});

module.exports = router;

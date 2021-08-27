const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// @router  POST api/users/register
// @desc    Register new users
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required.').notEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check(
      'password',
      'Please enter a password with minimum 6 characters.'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'User already exists.' }],
        });
      }
      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      res.json({ msg: 'User added', user });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

module.exports = router;

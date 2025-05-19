const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");

// @router  GET file/studentList
// @desc    Retrive student list format
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  // Try all the mongoDb operations
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.json(400).json({
        errors: [{ msg: "User with this Id does not exists." }],
      });
    }
    res.json(user);
  } catch (err) {
    // Catch any error that occurs due to mongoDb operations
    //
  }
});

module.exports = router;

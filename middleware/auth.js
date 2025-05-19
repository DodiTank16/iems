const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function that extracts token from request header and checks if it is valid or not and passes it to the API calls
module.exports = function (req, res, next) {
  let token;
  if ((token = req.header('x-auth-token'))) {
    try {
      const decoded = jwt.decode(token, config.get('loginToken'));
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid.' }] });
    }
  } else if ((token = req.header('x-admin-auth-token'))) {
    try {
      const decoded = jwt.decode(token, config.get('loginToken'));
      req.admin = decoded.admin;
      next();
    } catch (err) {
      return res.status(401).json({ errors: [{ msg: 'Token is not valid.' }] });
    }
  } else {
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token found, authorization denied.' }] });
  }
};

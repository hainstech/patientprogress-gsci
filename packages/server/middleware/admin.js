const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, auth denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    if (req.user.type === 'admin') {
      next();
    } else {
      res.status(401).json({ msg: 'Permission denied' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

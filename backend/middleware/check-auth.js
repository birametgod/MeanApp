const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_KEY = config.get('JWT_KEY');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userData = jwt.verify(token, JWT_KEY);
    req.userData = userData;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'you are not authenticated',
      err: err
    });
  }
};

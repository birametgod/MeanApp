const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userData = jwt.verify(token, 'my_token_is_secret');
    req.userData = userData;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'you are not authenticated',
      err: err
    });
  }
};

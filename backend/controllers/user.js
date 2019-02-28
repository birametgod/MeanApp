const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_KEY = config.get('JWT_KEY');

exports.signUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(200).json({
          message: 'user created',
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'sign up failed',
          err: error
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
  let userFetched;
  User.findOne({ email: req.body.email }, (error, result) => {
    if (error) {
      return res.status(401).json({
        message: 'auth failed',
        err: err
      });
    }

    if (!result) {
      return res.status(401).json({
        message: 'email not correct'
      });
    }

    userFetched = result;
    bcrypt.compare(req.body.password, userFetched.password).then(hash => {
      const token = jwt.sign({ email: userFetched.email, userId: userFetched._id }, JWT_KEY, {
        expiresIn: '1h'
      });

      if (hash) {
        res.status(200).json({
          message: 'Auth good',
          user: userFetched,
          token: token,
          expiresIn: 3600
        });
      } else {
        return res.status(401).json({
          message: 'password not correct'
        });
      }
    });
  });
};

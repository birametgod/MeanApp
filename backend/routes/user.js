const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
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
          err: error
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let userFetched;
  User.findOne({ email: req.body.email })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          // 401 MEANS UNAUTHORIZED
          message: 'Auth failed'
        });
      }
      userFetched = result;
      return bcrypt.compare(req.body.password, userFetched.password);
    })
    .then(hash => {
      const token = jwt.sign({ email: userFetched.email, userId: userFetched._id }, 'my_token_is_secret', {
        expiresIn: '1h'
      });
      if (hash) {
        res.status(200).json({
          message: 'Auth good',
          user: userFetched,
          token: token,
          expiresIn: 3600
        });
      }
    })
    .catch(error => {
      return res.status(200).json({
        message: 'auth failed',
        err: error
      });
    });
});

module.exports = router;

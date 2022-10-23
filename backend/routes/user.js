const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(200).json({
            message: 'User created!',
            result
          });
        })
        .catch(e => {
          res.status(500).json({
            error: e
          });
        });
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;

  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'we can\'t find you\'re email!'
        })
      }

      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      //result here from bcrypt compare function
      if (!result) {
        return res.status(500).json({
          message: 'Auth failed!'
        });
      }

      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 'secret_this_should_be_longer', {expiresIn: '1h'});

      res.status(200).json({
        token,
        expiresIn: 3600
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Auth failed!'
      })
    })
});

module.exports = router;

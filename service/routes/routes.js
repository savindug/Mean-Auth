const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user.controller');
const randtoken = require('rand-token');
const User = require('../models/User');

const refreshTokens = {};
const SECRET_KEY = 'MEAN_AUTH_SECRET';

const verifytoken = (req, res, next) => {
  const bearerheader = req.headers['authorization'];

  if (typeof bearerheader !== 'undefined') {
    const bearer = bearerheader.split(' ');
    const bearer_token = bearer[1];
    req.token = bearer_token;
    next();
  } else {
    res.sendStatus(403);
  }
};

router.get('/api', (req, res) => {
  res.json({
    messege: 'Welcome to jwt auth..',
  });
});

router.post('/api/post', verifytoken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        messege: 'Post created',
        authData: authData,
      });
    }
  });
});

router.post('/api/user', verifytoken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        messege: 'User created',
        authData: authData,
      });
    }
  });
});

router.post('/api/login', async (req, res) => {
  console.log(req.body);

  await userController.login(req.body.username, req.body.pwd).then((result) => {
    console.log(`SignIn = ${JSON.stringify(result)}`);
    if (result !== null) {
      const singIn = {
        _id: result._id,
        user: result.username,
      };

      jwt.sign({ singIn }, SECRET_KEY, { expiresIn: 600 }, (err, token) => {
        const refreshToken = randtoken.uid(256);
        refreshTokens[refreshToken] = singIn.username;
        res.status(200).json({
          jwt: token,
          refresh: refreshToken,
          status: 1,
        });
      });
    } else {
      res.json({
        status: 403,
        messege: 'unsuccessfull',
      });
    }
  });
});

router.post('/logout', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }
  res.sendStatus(204);
});

router.post('/api/register', async (req, res) => {
  console.log(req.body);

  await userController
    .createUser(req.body.username, req.body.email, req.body.pwd)
    .then((result) => {
      console.log(`SignIn = ${JSON.stringify(result)}`);
      if (result !== null) {
        let singUp = {
          _id: result._id,
          user: result.username,
        };
        jwt.sign({ singUp }, SECRET_KEY, { expiresIn: 600 }, (err, token) => {
          const refreshToken = randtoken.uid(256);
          refreshTokens[refreshToken] = singUp.username;
          res.json({
            jwt: token,
            refresh: refreshToken,
            status: 1,
          });
        });
      } else {
        res.json({
          status: 403,
          messege: 'unsuccessfull',
        });
      }
    });
});

router.post('/refresh', function (req, res) {
  const refreshToken = req.body.refreshToken;
  const username = req.body.username;

  if (refreshToken in refreshTokens) {
    const _user = userController.findUserByUsername(username);

    const user = {
      username: _user.username,
      email: _user.email,
      pwd: _user.pwd,
    };

    console.log(`findUserByUsername(${username}) ${user}`);
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: 600 });
    res.json({ jwt: token });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;

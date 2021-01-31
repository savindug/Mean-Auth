const mongoose = require('mongoose');
const { deleteOne } = require('../models/User');
const User = require('../models/User');

const createUser = async (username, email, pwd) => {
  const userModel = {
    userID: `${username}_${Date.now()}`,
    username: username,
    email: email,
    pwd: pwd,
  };

  try {
    let user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      return null;
    } else {
      return await User.create(userModel);
      //return 1;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const login = async (username, pwd) => {
  let user_data = null;
  try {
    await User.findOne(
      { $or: [{ email: username }, { username: username }] },
      function (err, user) {
        if (err) throw err;

        if (user !== null) {
          user.comparePassword(pwd, function (err, isMatch) {
            if (err) throw err;
            console.log(`${pwd} =`, isMatch);
            if (isMatch) {
              console.log(`res_user = ${JSON.stringify(user)}`);
              user_data = user;
            }
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  return user_data;
};

const updateRefreshToken = async (username, refreshToken) => {
  return await User.findOneAndUpdate(
    { username: username },
    { $set: { accessToken: 'refreshToken' } }
  );
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username: username });
};

module.exports = { createUser, login, updateRefreshToken, findUserByUsername };

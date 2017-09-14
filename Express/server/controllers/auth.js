import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import UserSchema from '../models/user.js';
const config = require('../../config/env');
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const userObj = {
    email: req.body.email,
  };
  UserSchema.findOneAsync(userObj, '+password')
    .then((user) => {
      if (!user) {
        const err = new APIError('User not found with the given email id', httpStatus.NOT_FOUND);
        return next(err);
      } else {
        user.comparePassword(req.body.password, (passwordError, isMatch) => {
          if (passwordError || !isMatch) {
            const err = new APIError('Incorrect password', httpStatus.UNAUTHORIZED);
            return next(err);
          }
          const token = jwt.sign(user, config.jwtSecret);
          UserSchema.findOneAndUpdateAsync({ _id: user._id }, { $set: user }, { new: true })
            .then((updatedUser) => {
              const returnObj = {
                success: true,
                message: 'user successfully logged in',
                data: {
                  jwtAccessToken: `JWT ${token}`,
                  user: updatedUser
                }
              };
              res.json(returnObj);
            })
            .error((err123) => {
              const err = new APIError(`error in updating user details while login ${err123}`, httpStatus.INTERNAL_SERVER_ERROR);
              next(err);
            });
        });
      }
    })
    .error((e) => {
      const err = new APIError(`erro while finding user ${e}`, httpStatus.INTERNAL_SERVER_ERROR);
      next(err);
    });
}

/** This is a protected route. Change login status to false and send success message.
* @param req
* @param res
* @param next
* @returns success message
*/
//
function logout(req, res, next) {
  const userObj = req.user;
  if (userObj === undefined || userObj === null) {
    console.log('user obj is null or undefined inside logout function', userObj);
  }
  UserSchema.findOneAndUpdate({ _id: userObj._id, }, { $set: userObj }, { new: true }, (err, userDoc) => {
    if (err) {
      console.log('error is here...............');
      const error = new APIError('error while updateing login status', httpStatus.INTERNAL_SERVER_ERROR);
      next(error);
    }
    if (userDoc) {
      const returnObj = {
        success: true,
        message: 'user logout successfully'
      };
      res.json(returnObj);
    } else {
      console.log('error is here@@@@@@@@@@@@@@@@@@@@@@@@');
      const error = new APIError('user not found', httpStatus.NOT_FOUND);
      next(error);
    }
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber, logout };

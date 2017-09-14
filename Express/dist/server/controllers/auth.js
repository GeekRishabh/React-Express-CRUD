'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _user = require('../models/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../config/env');
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  var userObj = {
    email: req.body.email
  };
  _user2.default.findOneAsync(userObj, '+password').then(function (user) {
    if (!user) {
      var err = new _APIError2.default('User not found with the given email id', _httpStatus2.default.NOT_FOUND);
      return next(err);
    } else {
      user.comparePassword(req.body.password, function (passwordError, isMatch) {
        if (passwordError || !isMatch) {
          var _err = new _APIError2.default('Incorrect password', _httpStatus2.default.UNAUTHORIZED);
          return next(_err);
        }
        var token = _jsonwebtoken2.default.sign(user, config.jwtSecret);
        _user2.default.findOneAndUpdateAsync({ _id: user._id }, { $set: user }, { new: true }).then(function (updatedUser) {
          var returnObj = {
            success: true,
            message: 'user successfully logged in',
            data: {
              jwtAccessToken: 'JWT ' + token,
              user: updatedUser
            }
          };
          res.json(returnObj);
        }).error(function (err123) {
          var err = new _APIError2.default('error in updating user details while login ' + err123, _httpStatus2.default.INTERNAL_SERVER_ERROR);
          next(err);
        });
      });
    }
  }).error(function (e) {
    var err = new _APIError2.default('erro while finding user ' + e, _httpStatus2.default.INTERNAL_SERVER_ERROR);
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
  var userObj = req.user;
  if (userObj === undefined || userObj === null) {
    console.log('user obj is null or undefined inside logout function', userObj);
  }
  _user2.default.findOneAndUpdate({ _id: userObj._id }, { $set: userObj }, { new: true }, function (err, userDoc) {
    if (err) {
      console.log('error is here...............');
      var error = new _APIError2.default('error while updateing login status', _httpStatus2.default.INTERNAL_SERVER_ERROR);
      next(error);
    }
    if (userDoc) {
      var returnObj = {
        success: true,
        message: 'user logout successfully'
      };
      res.json(returnObj);
    } else {
      console.log('error is here@@@@@@@@@@@@@@@@@@@@@@@@');
      var _error = new _APIError2.default('user not found', _httpStatus2.default.NOT_FOUND);
      next(_error);
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

exports.default = { login: login, getRandomNumber: getRandomNumber, logout: logout };
module.exports = exports['default'];
//# sourceMappingURL=auth.js.map

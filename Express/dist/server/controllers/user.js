'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  _user2.default.get(id).then(function (user) {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json({ success: true, message: 'User found', data: { user: req.user } });
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  _user2.default.findOneAsync({ email: req.body.email, userType: req.body.userType }).then(function (foundUser) {
    if (foundUser !== null) {
      return res.json({ success: false, message: 'User already exists', data: '' });
    }
    var user = new _user2.default({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    });
    user.saveAsync().then(function (savedUser) {
      var returnObj = {
        success: true,
        message: '',
        data: {}
      };
      var jwtAccessToken = _jsonwebtoken2.default.sign(savedUser, _env2.default.jwtSecret);
      returnObj.data.jwtAccessToken = 'JWT ' + jwtAccessToken;
      returnObj.data.user = savedUser;
      returnObj.message = 'User created successfully';
      res.json(returnObj);
    }).error(function (e) {
      return next(e);
    });
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Update existing user
 * @property {string} req.body.email - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function update(req, res, next) {
  var user = req.user;
  user.email = req.body.email ? req.body.email : user.email;
  user.name = req.body.name ? req.body.name : user.name;
  user.contact = req.body.contact ? req.body.contact : user.contact;
  user.password = req.body.password ? req.body.password : req.body.password;

  user.saveAsync().then(function (savedUser) {
    return res.json(savedUser);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  console.log('list .............');
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  _user2.default.list({ limit: limit, skip: skip }).then(function (users) {
    return res.json(users);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  var user = req.user;
  user.removeAsync().then(function (deletedUser) {
    return res.json(deletedUser);
  }).error(function (e) {
    return next(e);
  });
}

exports.default = { load: load, get: get, create: create, update: update, list: list, remove: remove };
module.exports = exports['default'];
//# sourceMappingURL=user.js.map

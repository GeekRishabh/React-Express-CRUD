'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var UserSchema = new _mongoose2.default.Schema({
  email: {
    type: String
  },
  name: {
    type: String
  },
  contact: {
    type: Array,
    default: []
  },
  password: {
    type: String,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  jwtAccessToken: {
    type: String,
    default: null
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function userSchemaPre(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    _bcrypt2.default.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      _bcrypt2.default.hash(user.password, salt, function (hashErr, hash) {
        if (hashErr) {
          return next(hashErr);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

/**
 * Methods
 */
/**
* comapare the stored hashed value of the password with the given value of the password
* @param pw - password whose value has to be compare
* @param cb - callback function
*/

UserSchema.methods.comparePassword = function comparePassword(pw, cb) {
  var that = this;
  _bcrypt2.default.compare(pw, that.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (user) {
      if (user) {
        return user;
      }
      var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },


  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit;

    return this.find().sort({ createdAt: -1 }).skip(skip).limit(limit).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('User', UserSchema);
module.exports = exports['default'];
//# sourceMappingURL=user.js.map

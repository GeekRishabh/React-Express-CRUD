import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import bcrypt from 'bcrypt';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String
  },
  name: {
    type: String
  },
  contact: {
    type : Array, 
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
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function userSchemaPre(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
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
  const that = this;
  bcrypt.compare(pw, that.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .execAsync().then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

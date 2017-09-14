'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

/** POST /api/users/register - create new user and return corresponding user object and token*/
router.route('/register').post((0, _expressValidation2.default)(_paramValidation2.default.createUser), _user2.default.create);

// MiddleWare.....

// router.use((req, res, next) => {
//   passport.authenticate('jwt', config.passportOptions, (error, userDtls, info) => {
//     if (error) {
//       const err = new APIError('token not matched', httpStatus.INTERNAL_SERVER_ERROR);
//       return next(err);
//     } else if (userDtls) {
//       req.user = userDtls;
//       next();
//     } else {
//       const err = new APIError(`token not matched ${info}`, httpStatus.UNAUTHORIZED);
//       return next(err);
//     }
//   })(req, res, next);
// });

router.route('/')
/** GET /api/users - Get list of users */
.get(_user2.default.get);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
.get(_user2.default.get)

/** PUT /api/users/:userId - Update user */
.put((0, _expressValidation2.default)(_paramValidation2.default.updateUser), _user2.default.update)

/** DELETE /api/users/:userId - Delete user */
.delete(_user2.default.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', _user2.default.load);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=user.js.map

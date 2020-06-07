const {
  SUCCESS, CREATED, BAD_REQUEST, SERVER_ERROR, UNAUTHORISED, NOT_FOUND,
} = require('./codes');

module.exports = {
  success(message) {
    return {
      code: SUCCESS,
      message,
    };
  },

  created(message) {
    return {
      code: CREATED,
      message,
    };
  },

  badRequest(message) {
    return {
      code: BAD_REQUEST,
      message,
    };
  },

  notFound(message) {
    return {
      code: NOT_FOUND,
      message,
    };
  },

  error(message) {
    return {
      code: SERVER_ERROR,
      message,
    };
  },

  unauthorised(message) {
    return {
      code: UNAUTHORISED,
      message,
    };
  },
};

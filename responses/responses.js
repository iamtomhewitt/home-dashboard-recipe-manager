const {
  SUCCESS, CREATED, BAD_REQUEST, SERVER_ERROR, UNAUTHORISED, NOT_FOUND,
} = require('./codes');

module.exports = {
  success(message) {
    return {
      status: SUCCESS,
      message,
    };
  },

  created(message) {
    return {
      status: CREATED,
      message,
    };
  },

  badRequest(message) {
    return {
      status: BAD_REQUEST,
      message,
    };
  },

  notFound(message) {
    return {
      status: NOT_FOUND,
      message,
    };
  },

  error(message) {
    return {
      status: SERVER_ERROR,
      message,
    };
  },

  unauthorised(message) {
    return {
      status: UNAUTHORISED,
      message,
    };
  },
};

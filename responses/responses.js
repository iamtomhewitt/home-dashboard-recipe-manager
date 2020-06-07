import {
  SUCCESS, CREATED, BAD_REQUEST, SERVER_ERROR, UNAUTHORISED, NOT_FOUND,
} from './codes';

export const success = (message) => ({
  status: SUCCESS,
  message,
});

export const created = (message) => ({
  status: CREATED,
  message,
});

export const badRequest = (message) => ({
  status: BAD_REQUEST,
  message,
});

export const notFound = (message) => ({
  status: NOT_FOUND,
  message,
});

export const error = (message) => ({
  status: SERVER_ERROR,
  message,
});

export const unauthorised = (message) => ({
  status: UNAUTHORISED,
  message,
});

import { JsonObject } from "../../../types/json";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const buildResponse = (statusCode: number, body: JsonObject) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const ok = (body: JsonObject) => buildResponse(200, body);

const badRequest = (body: JsonObject) => buildResponse(400, body);

const error = (body: JsonObject) => buildResponse(500, body);

export const apiResponse = {
  ok,
  badRequest,
  error,
};

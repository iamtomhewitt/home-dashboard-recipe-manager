import { badRequest, unauthorised } from '../responses/responses';

export const checkApiKey = (apiKey) => {
  if (!apiKey) {
    return badRequest('No API key specified');
  }

  if (apiKey !== process.env.API_KEY) {
    return unauthorised('API key is incorrect');
  }

  return null;
};

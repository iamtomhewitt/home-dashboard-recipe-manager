import { apiResponse } from '../../../lib/api-response';
import { updatePlanner } from '../../../lib/planner';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.queryStringParameters || !event.body) {
      return apiResponse.badRequest({
        message: 'No parameters or body supplied',
      });
    }

    const body = JSON.parse(event.body);
    const { id } = event.queryStringParameters;
    const { day, recipe } = body;

    if (!id || !day || !recipe) {
      return apiResponse.badRequest({
        message: 'Missing "id", "day" or "recipe"',
      });
    }

    await updatePlanner(id, day, recipe);

    return apiResponse.ok({
      message: 'Planner updated!',
    });
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

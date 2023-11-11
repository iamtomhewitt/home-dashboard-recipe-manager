import { getPlanner } from '../../../lib/planner';
import { apiResponse } from '../../../lib/api-response';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.pathParameters || !event.pathParameters.id) {
      return apiResponse.badRequest({
        message: 'No path parameters supplied',
      });
    }

    const { id } = event.pathParameters;
    const planner = await getPlanner(id);

    return apiResponse.ok(planner);
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

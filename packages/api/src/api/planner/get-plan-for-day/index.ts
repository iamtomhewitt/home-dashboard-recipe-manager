import { getPlanner } from '../../../lib/planner';
import { apiResponse } from '../../../lib/api-response';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.queryStringParameters) {
      return apiResponse.badRequest({
        message: 'No parameters supplied',
      });
    }

    const { id, day } = event.queryStringParameters;

    if (!id || !day) {
      return apiResponse.badRequest({
        message: 'No "id" or "day" params supplied',
      });
    }

    const { plan } = await getPlanner(id);
    const planForDay = plan.find((p) => p.day === day);

    return apiResponse.ok({ ...planForDay });
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

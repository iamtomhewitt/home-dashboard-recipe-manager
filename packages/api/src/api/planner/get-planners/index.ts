import { getData } from '../../../lib/planner';
import { apiResponse } from '../../../lib/api-response';

import { APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const { planners } = await getData();
  return apiResponse.ok({
    planners,
  });
};

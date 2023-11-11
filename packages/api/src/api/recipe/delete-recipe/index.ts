import { deleteRecipe } from '../../../lib/recipe';
import { apiResponse } from '../../../lib/api-response';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.queryStringParameters) {
      return apiResponse.badRequest({
        message: 'No parameters supplied',
      });
    }

    const { id, name } = event.queryStringParameters;

    if (!id || !name) {
      return apiResponse.badRequest({
        message: '"id" or "name" is missing from query parameter',
      });
    }

    await deleteRecipe(name, id);
    return apiResponse.ok({
      message: `${name} deleted!`,
    });
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

import { apiResponse } from '../../../lib/api-response';
import { saveRecipe } from '../../../lib/recipe';

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
    const { ingredients, name, steps } = body;

    if (!id) {
      return apiResponse.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    await saveRecipe({ ingredients, name, steps }, id);

    return apiResponse.ok({
      message: `${name} saved!`,
    });
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

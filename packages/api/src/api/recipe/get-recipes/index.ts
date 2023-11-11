import { findCookbook } from '../../../lib/recipe';
import { apiResponse } from '../../../lib/api-response';

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.queryStringParameters) {
      return apiResponse.badRequest({
        message: 'No parameters supplied',
      });
    }
    
    const { id } = event.queryStringParameters;

    if (!id) {
      return apiResponse.badRequest({
        message: '"id" is missing from query parameter',
      });
    }

    const cookbook = await findCookbook(id);

    if (!cookbook) {
      return apiResponse.badRequest({
        message: `Cookbook with id '${id}' not found!`,
      });
    }

    const { recipes } = cookbook;
    recipes.sort((a, b) => a.name.localeCompare(b.name));

    return apiResponse.ok(recipes);
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

import { getShoppingList } from '../../../lib/shopping-list';
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

    const shoppingList = await getShoppingList(id);

    return apiResponse.ok(shoppingList);
  } catch (err: any) {
    return apiResponse.error({
      message: err.message,
    });
  }
};

import { TodoistApi } from '@doist/todoist-api-typescript';

const addToShoppingList = async ({ items, shoppingListApiKey, shoppingListId }) => {
  const todoistApi = new TodoistApi(shoppingListApiKey);

  for (const item of items) {
    await todoistApi.addTask({
      projectId: shoppingListId,
      content: item,
    });
  }
};

const api = {
  addToShoppingList,
};

export default api;

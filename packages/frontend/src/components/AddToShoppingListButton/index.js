import React, { useState } from 'react';
import PropTypes from 'prop-types';

import recipeApi from '../../lib/api/recipe';
import shoppingListApi from '../../lib/api/shopping-list';

import './index.scss';

const AddToShoppingListButton = ({ shoppingListApiKey, shoppingListId, plannerId }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState();

  const onAddToShoppingList = async () => {
    try {
      setSuccessMessage('');
      setIsLoading(true);

      const items = await recipeApi.get(`/shoppingList?id=${plannerId}`);
      await shoppingListApi.addToShoppingList({ items, shoppingListApiKey, shoppingListId });

      setSuccessMessage(`Added ${items.length} items to your shopping list!`);
      setIsLoading(false);
    } catch (err) {
      setError(`${err}`);
      setSuccessMessage('');
      setIsLoading(false);
    }
  };

  return (
    <div className='add-to-shopping-list-button'>
      {error && (
        <div className='add-to-shopping-list-button-error' data-test-id='add-to-shopping-list-button-error'>
          Could not add to shopping list: {error}
        </div>
      )}

      {successMessage && (
        <div className='add-to-shopping-list-button-success' data-test-id='add-to-shopping-list-button-success'>
          {successMessage}
        </div>
      )}

      <button onClick={onAddToShoppingList} data-test-id='add-to-shopping-list-button' disabled={isLoading}>
        {isLoading ? 'Please wait' : 'Add to Shopping List'}
      </button>
    </div>
  );
};

AddToShoppingListButton.propTypes = {
  shoppingListApiKey: PropTypes.string.isRequired,
  shoppingListId: PropTypes.string.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default AddToShoppingListButton;

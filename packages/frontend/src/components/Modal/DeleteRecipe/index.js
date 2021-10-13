import React, { useState } from 'react';
import PropTypes from 'prop-types';

import http from '../../../lib/http';
import '../index.scss';

const DeleteRecipe = ({ recipe, hideModal }) => {
  const { name } = recipe;
  const [message, setMessage] = useState('');

  const onDelete = async () => {
    const json = await http.delete(`/recipes?name=${name}`);
    setMessage(json.message);
  };

  return (
    <div className='modal-delete-recipe' data-test-id='delete-recipe'>
      <h1>Delete "{name}"?</h1>
      <div className='modal-delete-recipe-buttons'>
        <div className='modal-delete-recipe-button-yes'>
          <button onClick={onDelete} data-test-id='delete-recipe-yes'>
            Yes
          </button>
        </div>
        <div className='modal-delete-recipe-button-no'>
          <button onClick={hideModal}>
            No
          </button>
        </div>
      </div>
      <div className='modal-delete-recipe-message'>
        {message}
      </div>
    </div>
  );
};

DeleteRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default DeleteRecipe;

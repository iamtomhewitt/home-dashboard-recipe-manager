import React, { useState } from 'react';
import PropTypes from 'prop-types';

import http from '../../../lib/http';
import './index.scss';

const DeleteRecipe = ({ recipe, hideModal, plannerId }) => {
  const { name } = recipe;
  const [message, setMessage] = useState('');

  const onDelete = async () => {
    const json = await http.delete(`/recipes?name=${name}&id=${plannerId}`);
    setMessage(json.message);
  };

  return (
    <div className='delete-recipe' data-test-id='delete-recipe'>
      <h1>Delete "{name}"?</h1>
      <div className='delete-recipe-buttons'>
        <div className='delete-recipe-button-yes'>
          <button onClick={onDelete} data-test-id='delete-recipe-yes'>
            Yes
          </button>
        </div>
        <div className='delete-recipe-button-no'>
          <button onClick={hideModal}>
            No
          </button>
        </div>
      </div>
      <div className='delete-recipe-message'>
        {message}
      </div>
    </div>
  );
};

DeleteRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default DeleteRecipe;

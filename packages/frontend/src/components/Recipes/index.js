import React, { useState } from 'react';
import PropTypes from 'prop-types';

import DeleteRecipe from '../Modal/DeleteRecipe';
import Modal from '../Modal';
import RecipeEditor from '../Modal/RecipeEditor';
import ViewRecipe from '../Modal/ViewRecipe';

import './index.scss';

const Recipes = ({ recipes, refreshRecipes }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();

  const openModal = (type, recipe) => {
    setShowModal(true);
    setModalData({ type, recipe });
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const getModal = () => {
    const { type, recipe } = modalData;
    const modals = {
      view: <ViewRecipe recipe={recipe} />,
      edit: <RecipeEditor isEditing recipe={recipe} />,
      delete: <DeleteRecipe recipe={recipe} hideModal={hideModal} />,
      add: <RecipeEditor />,
    };

    return (
      <Modal hideModal={hideModal}>
        {modals[type]}
      </Modal>
    );
  };

  return (
    <div className='recipes' data-test-id='recipes'>
      {recipes.map((recipe) => (
        <div className='recipes-row' key={recipe.name}>
          <div className='recipes-buttons'>
            <div className='recipes-name'>{recipe.name}</div>
            <button onClick={() => openModal('view', recipe)} data-test-id='recipes-view'>View</button>
            <button onClick={() => openModal('edit', recipe)} data-test-id='recipes-edit'>Edit</button>
            <button onClick={() => openModal('delete', recipe)} data-test-id='recipes-delete'>Delete</button>
          </div>
        </div>
      ))}
      <div className='recipes-page-buttons'>
        <button className='recipes-add-button' onClick={() => openModal('add', {})} data-test-id='recipes-add'>
          Add New Recipe
        </button>
        <button className='recipes-refresh-button' onClick={() => refreshRecipes()} data-test-id='recipes-refresh'>
          Refresh
        </button>
      </div>
      {showModal && getModal()}
    </div>
  );
};

Recipes.propTypes = {
  recipes: PropTypes.array.isRequired,
  refreshRecipes: PropTypes.func,
};

export default Recipes;

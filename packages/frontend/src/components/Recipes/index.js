import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DeleteRecipe from '../Modal/DeleteRecipe';
import Filter from '../Filter';
import Modal from '../Modal';
import RecipeEditor from '../Modal/RecipeEditor';
import ViewRecipe from '../Modal/ViewRecipe';
import api from '../../lib/api/recipe';

import './index.scss';

const Recipes = ({ plannerId }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/recipes?id=${plannerId}`);
      setRecipes(response);
      setFilteredRecipes(response);
    };
    getData();
  }, [plannerId]);

  const getRecipes = async () => {
    const response = await api.get(`/recipes?id=${plannerId}`);
    setRecipes(response);
    setFilteredRecipes(response);
  };

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
      edit: <RecipeEditor isEditing recipe={recipe} plannerId={plannerId} />,
      delete: <DeleteRecipe recipe={recipe} hideModal={hideModal} plannerId={plannerId} />,
      add: <RecipeEditor plannerId={plannerId} />,
    };

    return (
      <Modal hideModal={hideModal}>
        {modals[type]}
      </Modal>
    );
  };

  const onFilter = (event) => {
    const { value } = event.target;
    const updated = recipes.filter((r) => r.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredRecipes(updated);
  };

  return (
    <div className='recipes' data-test-id='recipes'>
      <Filter onFilter={onFilter} />

      <div className='recipes-page-buttons'>
        <button
          className='recipes-add-button'
          onClick={() => openModal('add', {})}
          data-test-id='recipes-add'
        >
          Add New Recipe
        </button>
        <button
          className='recipes-refresh-button'
          onClick={() => getRecipes()}
          data-test-id='recipes-refresh'
        >
          Refresh
        </button>
      </div>

      <div className='recipes-tiles'>
        {filteredRecipes.map((recipe) => (
          <div className='recipes-row' key={recipe.name}>
            <div className='recipes-name'>{recipe.name}</div>
            <div className='recipes-buttons'>
              <button onClick={() => openModal('view', recipe)} data-test-id='recipes-view'>View</button>
              <button onClick={() => openModal('edit', recipe)} data-test-id='recipes-edit'>Edit</button>
              <button onClick={() => openModal('delete', recipe)} data-test-id='recipes-delete'>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && getModal()}
    </div>
  );
};

Recipes.propTypes = {
  plannerId: PropTypes.string.isRequired,
};

export default Recipes;

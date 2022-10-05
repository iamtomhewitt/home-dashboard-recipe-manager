import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Ingredient from '../../Ingredient';
import http from '../../../lib/http';
import './index.scss';

const RecipeEditor = ({ isEditing, recipe, plannerId }) => {
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(recipe?.name || '');
  const [originalName] = useState(recipe?.name || '');
  const [steps, setSteps] = useState(recipe?.steps || []);

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const addIngredient = () => {
    const newIngredient = {
      name: '',
      amount: 0,
      category: '',
      weight: 'grams',
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const onChangeIngredient = (e, index) => {
    const { id, value } = e.target;
    ingredients[index] = {
      ...ingredients[index],
      [id]: value,
    };
    setIngredients([...ingredients]);
  };

  const onRemoveIngredient = (index) => {
    ingredients.splice(index, 1);
    setIngredients([...ingredients]);
  };

  const addStep = () => {
    setSteps([...steps, 'Add step']);
  };

  const onChangeStep = (e) => {
    const { value, id } = e.target;
    steps[id] = value;
    setSteps([...steps]);
  };

  const onRemoveStep = (index) => {
    steps.splice(index, 1);
    setSteps([...steps]);
  };

  const onSubmit = async () => {
    const body = {
      ingredients,
      steps,
      name,
      originalName,
    };

    const url = `/recipes?id=${plannerId}`;
    const json = isEditing ?
      await http.put(url, body) :
      await http.post(url, body);

    setMessage(json.message);
  };

  return (
    <div className='recipe-editor' data-test-id='recipe-editor'>
      <h1>Recipe Editor</h1>

      <div className='recipe-editor-name'>
        <input placeholder='name' value={name} onChange={onChangeName} data-test-id='recipe-editor-name-input' />
      </div>

      <div className='recipe-editor-ingredients'>
        <h3>Ingredients</h3>
        {ingredients.map((i, k) => <Ingredient ingredient={i} key={k} index={k} onChange={onChangeIngredient} onRemove={onRemoveIngredient} />)}
        <div className='recipe-editor-ingredients-add-button'>
          <button onClick={addIngredient} data-test-id='recipe-editor-add-ingredient-button'>
            Add Ingredient
          </button>
        </div>
      </div>

      <div className='recipe-editor-steps'>
        <h3>Steps</h3>
        {steps.map((s, i) => <Step step={s} onChange={onChangeStep} onRemove={onRemoveStep} key={i} index={i} />)}
        <div className='recipe-editor-steps-add-button'>
          <button onClick={addStep} data-test-id='recipe-editor-add-step-button'>
            Add Step
          </button>
        </div>
      </div>

      <div className='recipe-editor-submit-button'>
        <button onClick={onSubmit} data-test-id='recipe-editor-submit-button'>
          Submit
        </button>
      </div>

      <div className='recipe-editor-message'>
        {message}
      </div>
    </div>
  );
};

const Step = ({ step, index, onChange, onRemove }) => (
  <div className='recipe-editor-step' id={index} data-test-id='step'>
    <div>
      <textarea value={step} id={index} onChange={onChange} data-test-id='step-input' />
    </div>
    <div className='recipe-editor-step-remove-button'>
      <button onClick={() => onRemove(index)} data-test-id='step-remove-button'>Remove Step</button>
    </div>
  </div>
);

RecipeEditor.propTypes = {
  isEditing: PropTypes.bool,
  recipe: PropTypes.object,
  plannerId: PropTypes.string.isRequired,
};

Step.propTypes = {
  index: PropTypes.number,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  step: PropTypes.string,
};

export default RecipeEditor;

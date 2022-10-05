import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const ViewRecipe = ({ recipe }) => {
  const { name, ingredients, steps } = recipe;

  return (
    <div className='view-recipe' data-test-id='view-recipe'>
      <h1>{name}</h1>
      <div className='view-recipe-info'>
        <ul className='view-recipe-info-left'>
          {ingredients && ingredients.map((i) => {
            const formatted = `${i.amount} ${i.weight} of ${i.name}`.replace('quantity of', '');
            return <li key={i.name}>{formatted}</li>;
          })}
        </ul>
        <ul className='view-recipe-info-right'>
          {steps && steps.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
    </div>
  );
};

ViewRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default ViewRecipe;

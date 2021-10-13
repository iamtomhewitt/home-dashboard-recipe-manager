import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import CloseIcon from '../CloseIcon';
import './index.scss';

const categories = [
  { value: 'Alcohol', label: 'Alcohol' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Cereals', label: 'Cereals' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Freezer', label: 'Freezer' },
  { value: 'Fruit / Vegetables', label: 'Fruit / Vegetables' },
  { value: 'Home Essentials', label: 'Home Essentials' },
  { value: 'Meat', label: 'Meat' },
  { value: 'Rice / Pasta / Condiments', label: 'Rice / Pasta / Condiments' },
  { value: 'Soft Drinks', label: 'Soft Drinks' },
  { value: 'Tins', label: 'Tins' },
  { value: 'Toiletries', label: 'Toiletries' },
];

const weights = [
  { value: 'grams', label: 'grams' },
  { value: 'quantity', label: 'quantity' },
  { value: 'teaspoon', label: 'teaspoon' },
  { value: 'tablespoon', label: 'tablespoon' },
  { value: 'mls', label: 'mls' },
];

const Ingredient = ({ index, ingredient, onChange, onRemove }) => (
  <div className='ingredient' data-test-id='ingredient'>
    <div className='ingredient-close-button' onClick={() => onRemove(index)} data-test-id='ingredient-remove-button'>
      <CloseIcon />
    </div>
    <div className='ingredient-row'>
      <input value={ingredient.name} onChange={(e) => onChange(e, index)} id='name' placeholder='name' data-test-id='ingredient-input-name' />
      <input value={ingredient.amount} onChange={(e) => onChange(e, index)} id='amount' placeholder='amount' type='number' data-test-id='ingredient-input-amount' />
    </div>
    <div className='ingredient-row'>
      <Options value={ingredient.weight} type='weight' options={weights} onChange={onChange} index={index} />
      <Options value={ingredient.category} type='category' options={categories} onChange={onChange} index={index} />
    </div>
  </div>
);

const Options = ({ type, options, onChange, index, value }) => (
  <span className='ingredient-select'>
    <ReactSelect
      onChange={(e) => onChange({ target: { id: type, value: e.value } }, index)}
      options={options}
      placeholder={type}
      value={{ label: value, value }}
    />
  </span>
);

Ingredient.propTypes = {
  index: PropTypes.number,
  ingredient: PropTypes.object,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

Options.propTypes = {
  index: PropTypes.number,
  onChange: PropTypes.func,
  options: PropTypes.array,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default Ingredient;

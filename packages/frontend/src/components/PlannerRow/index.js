import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';

import 'react-dropdown/style.css';
import './index.scss';

const PlannerRow = ({ day, recipeOptions, value, recipeForSelected, onChange }) => {
  const [useCustom, setUseCustom] = useState(false);
  const [customEntry, setCustomEntry] = useState('');

  const onToggleCheckbox = () => {
    setUseCustom(!useCustom);
  };

  const onChangeCustomEntry = (e) => {
    setCustomEntry(e.target.value);
    onChange(e.target, day);
  };

  return (
    <div className='planner-row' key={day}>
      <div className='planner-row-header'>
        <span>{day}</span>
        <div className='planner-row-custom-toggle'>
          <input type='checkbox' onChange={onToggleCheckbox} value={customEntry} />
          <span>Custom Recipe</span>
        </div>
      </div>
      <div className='planner-row-recipe' data-test-id='planner-row-recipe'>
        {useCustom ?
          <input type='text' onChange={onChangeCustomEntry} />
          :
          <Dropdown
            day={day}
            onChange={onChange}
            onInputChange={onChange}
            options={recipeOptions}
            value={{ label: value, value }}
          />
        }
      </div>
      {recipeForSelected &&
        <div className='planner-row-recipe-info'>
          <span>{recipeForSelected.ingredients?.length || 0} ingredient(s)</span>
          <span>{recipeForSelected.steps?.length || 0} step(s)</span>
        </div>
      }
    </div>
  );
};

PlannerRow.propTypes = {
  day: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  recipeForSelected: PropTypes.any,
  recipeOptions: PropTypes.array,
  value: PropTypes.string.isRequired,
};

export default PlannerRow;

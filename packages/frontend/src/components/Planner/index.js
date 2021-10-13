import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

import LoadingIcon from '../LoadingIcon';
import http from '../../lib/http';
import './index.scss';

const Planner = ({ planner, recipes, plannerId }) => {
  const { plan } = planner;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [state, setState] = useState({});
  const recipeOptions = recipes.map((r) => ({ value: r.name, label: r.name }));

  const onSave = async (day, recipe) => {
    setIsLoading(true);
    setMessage('');

    const body = { day, recipe };
    await http.put(`/planner?id=${plannerId}`, body);

    setIsLoading(false);
    setMessage(`${day}: '${recipe}' saved!`);
  };

  const onChange = (e, day) => {
    if (e && e.value) {
      setState({
        ...state,
        [day]: e.value,
      });
    }
  };

  return (
    <div className='planner' data-test-id='planner'>
      <h2>Planner</h2>
      {plan.map(({ day, recipe }) => {
        const value = state[day] || recipe;

        return (
          <div className='planner-row' key={day}>
            <div className='planner-day'>
              <span>{day}</span>
            </div>
            <div className='planner-recipe'>
              <CreatableSelect
                day={day}
                onChange={(e) => onChange(e, day)}
                onInputChange={(e) => onChange(e, day)}
                options={recipeOptions}
                value={{ label: value, value }}
              />
            </div>
            <button className='planner-save-button' onClick={() => onSave(day, value)} data-test-id='planner-save-button'>
              Save
            </button>
          </div>
        );
      })}

      {isLoading &&
        <div className='planner-loading'>
          <LoadingIcon />
        </div>
      }

      {message &&
        <div className='planner-message'>
          {message}
        </div>
      }
    </div>
  );
};

Planner.propTypes = {
  planner: PropTypes.object.isRequired,
  recipes: PropTypes.array.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default Planner;

import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

import LoadingIcon from '../LoadingIcon';
import http from '../../lib/http';

import './index.scss';

const Planner = ({ planner, plannerId }) => {
  const { plan } = planner;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [state, setState] = useState({});
  const recipeOptions = recipes.map((r) => ({ value: r.name, label: r.name }));

  useEffect(() => {
    const getRecipes = async () => {
      const response = await http.get(`/recipes?id=${plannerId}`);
      setRecipes(response);
    };
    getRecipes();
  }, [plannerId]);

  const onSaveAll = async () => {
    setIsLoading(true);
    setMessage('');

    for (const day of Object.keys(state)) {
      const recipe = state[day];
      const body = { day, recipe };
      await http.put(`/planner?id=${plannerId}`, body);
    }

    setIsLoading(false);
    setMessage('Planner saved!');
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
      {plan.map(({ day, recipe }) => {
        const value = state[day] || recipe;
        const recipeForSelected = recipes.filter((x) => x.name === value)[0];

        return (
          <div className='planner-row' key={day}>
            <div className='planner-day'>
              <span>{day}</span>
            </div>
            <div className='planner-recipe' data-test-id='planner-recipe'>
              <CreatableSelect
                day={day}
                onChange={(e) => onChange(e, day)}
                onInputChange={(e) => onChange(e, day)}
                options={recipeOptions}
                value={{ label: value, value }}
              />
            </div>
            {recipeForSelected &&
              <div className='planner-recipe-info'>
                <span>{recipeForSelected.ingredients?.length || 0} ingredient(s)</span>
                <span>{recipeForSelected.steps?.length || 0} step(s)</span>
              </div>
            }
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

      <button className='planner-save-button' onClick={() => onSaveAll()} data-test-id='planner-save-button'>
        Save All
      </button>
    </div>
  );
};

Planner.propTypes = {
  planner: PropTypes.object.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default Planner;

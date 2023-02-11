import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AddToShoppingListButton from '../AddToShoppingListButton';
import LoadingIcon from '../LoadingIcon';
import PlannerRow from '../PlannerRow';
import api from '../../lib/api/recipe';

import './index.scss';

const Planner = ({ planner, plannerId }) => {
  const { plan, shoppingListApiKey, shoppingListId } = planner;
  const [days, setDays] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [recipes, setRecipes] = useState([]);
  const recipeOptions = recipes.map((r) => ({ value: r.name, label: r.name }));
  const hasShoppingListConfig = !!shoppingListApiKey && !!shoppingListId;

  useEffect(() => {
    const getRecipes = async () => {
      const response = await api.get(`/recipes?id=${plannerId}`);
      setRecipes(response);
    };
    getRecipes();
  }, [plannerId]);

  const onSaveAll = async () => {
    setIsLoading(true);
    setMessage('');

    for (const day of Object.keys(days)) {
      const recipe = days[day];
      const body = { day, recipe };
      await api.put(`/planner?id=${plannerId}`, body);
    }

    setIsLoading(false);
    setMessage('Planner saved!');
  };

  const onChange = (e, day) => {
    if (e && e.value) {
      setDays({
        ...days,
        [day]: e.value,
      });
    }
  };

  return (
    <div className='planner' data-test-id='planner'>
      {plan.map(({ day, recipe }) => {
        const value = days[day] || recipe;
        const recipeForSelected = recipes.filter((x) => x.name === value)[0];

        return (
          <PlannerRow
            day={day}
            onChange={(e) => onChange(e, day)}
            recipeForSelected={recipeForSelected}
            recipeOptions={recipeOptions}
            value={value}
          />
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

      <div className='planner-buttons'>
        <div className='planner-buttons-container'>
          {hasShoppingListConfig && (
            <AddToShoppingListButton
              plannerId={plannerId}
              shoppingListApiKey={planner.shoppingListApiKey}
              shoppingListId={planner.shoppingListId}
            />
          )}

          <button
            className='planner-buttons-container-save-button'
            data-test-id='planner-save-button'
            onClick={() => onSaveAll()}
          >
            Save All
          </button>
        </div>
      </div>
    </div>
  );
};

Planner.propTypes = {
  planner: PropTypes.object.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default Planner;

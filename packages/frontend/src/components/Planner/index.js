import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import LoadingIcon from '../LoadingIcon';
import PlannerRow from '../PlannerRow';
import http from '../../lib/http';

import './index.scss';

const Planner = ({ planner, plannerId }) => {
  const { plan } = planner;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [days, setDays] = useState({});
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

    for (const day of Object.keys(days)) {
      const recipe = days[day];
      const body = { day, recipe };
      await http.put(`/planner?id=${plannerId}`, body);
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
            value={value}
            recipeForSelected={recipeForSelected}
            recipeOptions={recipeOptions}
            onChange={(e) => onChange(e, day)}
          />
        )
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

      <div className='planner-save-button'>
        <button onClick={() => onSaveAll()} data-test-id='planner-save-button'>
          Save All
        </button>
      </div>
    </div>
  );
};

Planner.propTypes = {
  planner: PropTypes.object.isRequired,
  plannerId: PropTypes.string.isRequired,
};

export default Planner;

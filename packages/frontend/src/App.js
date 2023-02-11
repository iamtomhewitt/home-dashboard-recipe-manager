import React, { useState } from 'react';

import Landing from './components/Landing';
import LoadingIcon from './components/LoadingIcon';
import Navigation from './components/Navigation';
import Planner from './components/Planner';
import Recipes from './components/Recipes';
import api from './lib/api/recipe';

import './App.scss';

const App = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [planner, setPlanner] = useState();
  const [plannerId, setPlannerId] = useState();
  const [tab, setTab] = useState('planner');

  const getPlanner = async (id) => {
    try {
      setPlannerId(id);
      setError('');
      setIsLoading(true);

      const json = await api.get(`/planner/${id}`);

      setPlanner(json);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const changeTab = (t) => {
    setTab(t);
  };

  return (
    <div className='app' data-test-id='app'>
      <Navigation planner={planner} changeTab={changeTab} tab={tab} />

      {!planner && <Landing getPlanner={getPlanner} />}

      {planner && tab === 'planner' && <Planner planner={planner} plannerId={plannerId} />}
      {planner && tab === 'recipes' && <Recipes plannerId={plannerId} />}

      {isLoading &&
        <div className='app-loading'>
          <LoadingIcon />
        </div>
      }

      {error &&
        <div className='app-error' data-test-id='app-error'>
          {error}
        </div>
      }
    </div>
  );
};

export default App;

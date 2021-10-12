import React from 'react';

import Landing from './components/Landing';
import LoadingIcon from './components/LoadingIcon';
import Navigation from './components/Navigation';
import Planner from './components/Planner';
import Recipes from './components/Recipes';
import http from './lib/http';

import './App.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      isLoading: false,
      tab: 'planner',
    };
  }

  async componentDidMount() {
    this.getRecipes();
  }

  getRecipes = async () => {
    const recipes = await http.get('/recipes');
    this.setState({ recipes });

    const r = await fetch('/api/health');
    console.log(r)
    const j = await r.json();
    console.log(j)
  }

  getPlanner = async (plannerId) => {
    this.setState({ isLoading: true, error: '', plannerId });

    const json = await http.get(`/planner/${plannerId}`);

    if (json.error) {
      this.setState({ isLoading: false, error: json.error });
    } else {
      this.setState({ isLoading: false, planner: json, error: '' });
    }
  }

  changeTab = (tab) => this.setState({ tab })

  render() {
    const { error, isLoading, planner, plannerId, recipes, tab } = this.state;

    return (
      <div className='app' data-test-id='app'>
        <Navigation planner={planner} changeTab={this.changeTab} />

        {!planner && <Landing getPlanner={this.getPlanner} />}

        {planner && tab === 'planner' && <Planner planner={planner} recipes={recipes} plannerId={plannerId} />}
        {planner && tab === 'recipes' && <Recipes recipes={recipes} refreshRecipes={this.getRecipes} />}

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
  }
}

export default App;

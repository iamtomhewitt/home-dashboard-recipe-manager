import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Navigation = ({ planner, changeTab, tab }) => {
  if (!planner) return null;

  const className = (highlight) => `navigation-${highlight ? '' : 'un'}highlighted`;

  return (
    <div className='navigation' data-test-id='navigation'>
      <div className={className(tab === 'planner')} onClick={() => changeTab('planner')} data-test-id='navigation-tab'>Planner</div>
      <div className={className(tab === 'recipes')} onClick={() => changeTab('recipes')} data-test-id='navigation-tab'>Recipes</div>
    </div>
  );
};

Navigation.propTypes = {
  planner: PropTypes.object,
  changeTab: PropTypes.func,
  tab: PropTypes.string,
};

export default Navigation;

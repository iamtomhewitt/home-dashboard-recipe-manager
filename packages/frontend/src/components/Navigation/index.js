import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Navigation = ({ planner, changeTab }) => {
  if (!planner) return null;

  return (
    <div className='navigation' data-test-id='navigation'>
      <div onClick={() => changeTab('planner')} data-test-id='navigation-tab'>Planner</div>
      <div onClick={() => changeTab('recipes')} data-test-id='navigation-tab'>Recipes</div>
    </div>
  );
};

Navigation.propTypes = {
  planner: PropTypes.object,
  changeTab: PropTypes.func,
};

export default Navigation;

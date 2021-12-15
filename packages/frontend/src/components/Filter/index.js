import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Filter = ({ onFilter }) => (
  <div className='filter' data-test-id='filter'>
    <input type='search' onChange={onFilter} placeholder='Search for recipe...' />
  </div>
);

Filter.propTypes = {
  onFilter: PropTypes.func,
};

export default Filter;

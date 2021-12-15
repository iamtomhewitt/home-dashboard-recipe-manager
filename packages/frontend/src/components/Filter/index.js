import React from "react";

import './index.scss';

const Filter = ({ onFilter }) => {

  return (
    <div className="filter">
      <input type='search' onChange={onFilter} placeholder='Search for recipe...' />
    </div>
  )
}

export default Filter;
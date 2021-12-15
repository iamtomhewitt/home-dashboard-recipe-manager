import React from "react";

const Filter = ({ onFilter }) => {

  return (
    <div>
      Filter
      <input type='search' onChange={onFilter} />
    </div>
  )
}

export default Filter;
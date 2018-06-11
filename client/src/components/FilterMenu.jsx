import React from 'react';

const FilterMenu = props => {
  const filterCategories = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free'];

  return (
    <div className="filterContainer">
      <h5>Filters:</h5>
      {filterCategories.map((category, i) => {
        return (
          <div className="filterBtn" key={i} onClick={props.handleClick}>
            <input className="filterCheckbox" type="checkbox" checked={props.filters[category] ? 'checked' : ''}></input>
            <div className="filterTitle">{category}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterMenu;

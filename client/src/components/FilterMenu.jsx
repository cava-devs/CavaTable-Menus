import React from 'react';
import styles from '../styles/FilterMenu.css';

const FilterMenu = props => {
  const filterCategories = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free'];

  return (
    <div className={styles.filterContainer}>
      <h5>Filters:</h5>
      {filterCategories.map((category, i) => {
        return (
          <div className={styles.filterBtn} key={i} onClick={props.handleClick}>
            <input className={styles.filterCheckbox} type="checkbox" checked={props.filters[category] ? 'checked' : ''}></input>
            <div className={styles.filterTitle}>{category}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterMenu;

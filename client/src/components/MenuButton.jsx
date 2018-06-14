import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/MenuButton.css';

const MenuButton = props => {
  const createDisplayTitle = name => {
    const withSpaces = name.replace('_', ' ');
    const capitalize = withSpaces.split(' ')
                        .map(word => word[0].toUpperCase() + word.slice(1))
                        .join(' ');
    return capitalize;
  }
  
  return (
    <div className={props.selectedSubMenu === props.name ? `${styles.menuBtn} ${styles.selected}` : `${styles.menuBtn}`}
    onClick={props.handleClick}>
      {createDisplayTitle(props.name)}
    </div>
  );
};

MenuButton.propTypes = {
  name: PropTypes.string,
  selectedSubMenu: PropTypes.string,
  handleClick: PropTypes.func,
};

export default MenuButton;

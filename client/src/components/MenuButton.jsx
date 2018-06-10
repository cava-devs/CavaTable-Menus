import React from 'react';

const MenuButton = props => {
  const createDisplayTitle = name => {
    const withSpaces = name.replace('_', ' ');
    const capitalize = withSpaces.split(' ')
                        .map(word => word[0].toUpperCase() + word.slice(1))
                        .join(' ');
    return capitalize;
  }
  
  return (
    <div className={props.selected === props.name ? 'menuBtn selected' : 'menuBtn'}
    onClick={props.handleClick}>
      {createDisplayTitle(props.name)}
    </div>
  );
};

export default MenuButton;
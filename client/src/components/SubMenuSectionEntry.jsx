import React from 'react';
import PropTypes from 'prop-types';

const SubMenuSectionEntry = props => (
  <div className="entryContainer">
    <span className="entryName">{props.entry.name}</span>
    <div className="entryPrice">{props.entry.price}</div>
    <div className="entryDescription">{props.entry.desc}</div>
  </div>
);

SubMenuSectionEntry.propTypes = {
  entry: PropTypes.object,
};

export default SubMenuSectionEntry;


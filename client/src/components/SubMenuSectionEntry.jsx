import React from 'react';

const SubMenuSectionEntry = props => (
  <div className="entryContainer">
    <span className="entryName">{props.entry.name}</span>
    <div className="entryPrice">{props.entry.price}</div>
    <div className="entryDescription">{props.entry.desc}</div>
  </div>
);

export default SubMenuSectionEntry;

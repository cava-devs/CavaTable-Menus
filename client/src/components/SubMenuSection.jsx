import React from 'react';
import PropTypes from 'prop-types';
import SubMenuSectionEntry from './SubMenuSectionEntry.jsx';

const SubMenuSection = (props) => {
  const createEntryColumns = entriesArr => {
    const column1Arr = [];
    const column2Arr = [];
    let alternateCounter = true;
    entriesArr.forEach(entryObj => {
      if (alternateCounter) {
        column1Arr.push(entryObj);
      } else if (!alternateCounter) {
        column2Arr.push(entryObj);
      }
      alternateCounter = !alternateCounter;
    });
    return { column1: column1Arr, column2: column2Arr };
  };

  const filterEntries = (entriesArr, filterObj) => {
    let filters = Object.keys(filterObj);
    let filteredEntries = entriesArr.filter(entry => {
      for (let i = 0; i < filters.length; i++) {
        if (!entry.filter_categories[filters[i]]) {
          return false;
        }
      }
      return true;
    });
    return filteredEntries;
  };

  let filteredEntries = filterEntries(props.sectionObj.entries, props.filterObj);

  return (
    <div className="sectionBody">
      <div className="sectionTitle">{props.sectionObj.menu_section}</div>
      <div className="container sectionContainer">
        <div className="row">
          <div className="col">
            {createEntryColumns(filteredEntries).column1.map((entry, i) => {
              return <SubMenuSectionEntry entry={entry} key={i} />;
            })}
          </div>
          <div className="col">
            {createEntryColumns(filteredEntries).column2.map((entry, i) => {
              return <SubMenuSectionEntry entry={entry} key={i} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

SubMenuSection.propTypes = {
  sectionObj: PropTypes.object,
  filterObj: PropTypes.object,
};

export default SubMenuSection;

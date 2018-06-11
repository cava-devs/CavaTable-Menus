import React from 'react';
import axios from 'axios';
import MenuButton from './MenuButton.jsx';
import FilterMenu from './FilterMenu.jsx';
import SubMenuSection from './SubMenuSection.jsx';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {},
      selectedSubMenu: '',
      selectedFilters: {},
    };
    this.subMenusList = [];
    this.getMenuObj();

    this.handleMenuBtnClick = this.handleMenuBtnClick.bind(this);
    this.handleFilterBtnClick = this.handleFilterBtnClick.bind(this);
  }

  getMenuObj() {
    axios.get('/restaurant/1001/menu')
      .then(response => {
        this.findSubMenusList(response.data[0]);
        this.setState({
          menu: response.data[0],
          selectedSubMenu: this.subMenusList[0],
        });
      })
      .catch(err => console.error(err));
  }

  findSubMenusList(menuObj) {
    const subMenusList = [];
    const properties = Object.keys(menuObj);
    properties.forEach(prop => {
      if (Array.isArray(menuObj[prop])) {
        subMenusList.push(prop);
      }
    });
    this.subMenusList = subMenusList;
  }

  handleMenuBtnClick(event) {
    let innerHTML = event.target.innerHTML.toLowerCase().replace(' ', '_');
    this.setState({
      selectedSubMenu: innerHTML,
    });
  }

  handleFilterBtnClick(event) {
    let filters = Object.assign({}, this.state.selectedFilters);
    let targetFilter = event.target.parentElement.querySelector('.filterTitle');
    if (filters[targetFilter.innerHTML]) {
      delete filters[targetFilter.innerHTML];
    } else {
      filters[targetFilter.innerHTML] = true;
    }
    this.setState({
      selectedFilters: filters,
    });
  }

  render() {
    return (
      <div className="card border-0 rounded-0">
        <div className="card-body">
          <h1 className="menu-title">Menu</h1>
          <div className="menuBtnContainer">
            {this.subMenusList.map((subMenu, i) => {
              return <MenuButton name={subMenu} selectedSubMenu={this.state.selectedSubMenu} key={i} 
                      handleClick={this.handleMenuBtnClick} />;
            })}
            <FilterMenu filters={this.state.selectedFilters} handleClick={this.handleFilterBtnClick} />
          </div>
          <div>
            {this.state.selectedSubMenu.length > 0 ? 
            this.state.menu[this.state.selectedSubMenu].map((sectionObj, i) => {
              return <SubMenuSection sectionObj={sectionObj} filterObj={this.state.selectedFilters} key={i} />;
            }) : null}
          </div>
        </div>
      </div>
    );
  }
} 

export default Menu;

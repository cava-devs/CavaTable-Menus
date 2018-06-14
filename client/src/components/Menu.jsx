import React from 'react';
import axios from 'axios';
import _ from 'underscore';
import MenuButton from './MenuButton.jsx';
import FilterMenu from './FilterMenu.jsx';
import SubMenuSection from './SubMenuSection.jsx';
import styles from '../styles/Menu.css';
import { filterTitle } from '../styles/FilterMenu.css';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {},
      selectedSubMenu: '',
      selectedFilters: {},
      displayAll: false,
    };
    this.subMenusList = [];
    this.getMenuObj();
    this.handleScroll();
    console.log(filterTitle);

    this.handleMenuBtnClick = this.handleMenuBtnClick.bind(this);
    this.handleFilterBtnClick = this.handleFilterBtnClick.bind(this);
    this.toggleDisplayAll = this.toggleDisplayAll.bind(this);
  }

  getMenuObj() {
    axios.get(`/restaurant/${this.props.match.params.restaurantId}/menu`)
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
    let targetFilter = event.target.parentElement.querySelector(`.${filterTitle}`);
    if (filters[targetFilter.innerHTML]) {
      delete filters[targetFilter.innerHTML];
    } else {
      filters[targetFilter.innerHTML] = true;
    }
    this.setState({
      selectedFilters: filters,
    });
  }

  toggleDisplayAll() {
    const menuContentContainer = document.getElementById('menuContentContainer');
    const displayAllBtn = document.getElementById('displayAllBtn');
    menuContentContainer.classList.toggle(styles.hidden);
    if (displayAllBtn.innerHTML === 'View full menu') {
      displayAllBtn.classList.add('fixed');
    } else if (displayAllBtn.innerHTML === 'Collapse menu') {
      displayAllBtn.classList.remove('fixed');
    }
    this.setState({
      displayAll: !this.state.displayAll,
    });
  }

  checkScrollPosition() {
    const menuModule = document.getElementById('menuModule');
    const displayAllBtn = document.getElementById('displayAllBtn');
    let scrollPosition = window.pageYOffset;
    let minHeight = menuModule.getBoundingClientRect().top + scrollPosition;
    let maxHeight = menuModule.offsetHeight * 0.65 + minHeight;
    if (minHeight >= scrollPosition || scrollPosition > maxHeight) {
      displayAllBtn.classList.remove('fixed');
    }
  }

  handleScroll() {
    document.addEventListener('DOMContentLoaded', () => {
      document.addEventListener('scroll', () => {
        if (this.state.displayAll) {
          _.debounce(this.checkScrollPosition, 300)();
        }
      }, false);
    }, false);
  }

  render() {
    return (
      <div className={`card border-0 rounded-0 ${styles.menuModule}`}>
        <div className={`card-body ${styles.menuBody}`}>
          <h1 className={styles['menu-title']}>Menu</h1>
          <div className={styles.menuBtnContainer}>
            {this.subMenusList.map((subMenu, i) => {
              return <MenuButton name={subMenu} selectedSubMenu={this.state.selectedSubMenu} key={i} 
                      handleClick={this.handleMenuBtnClick} />;
            })}
            <FilterMenu filters={this.state.selectedFilters} handleClick={this.handleFilterBtnClick} />
          </div>
          <div id="menuContentContainer" className={styles.hidden}>
            {this.state.selectedSubMenu.length > 0 ? 
            this.state.menu[this.state.selectedSubMenu].map((sectionObj, i) => {
              return <SubMenuSection sectionObj={sectionObj} filterObj={this.state.selectedFilters} key={i} />;
            }) : null}
          </div>
          {!this.state.displayAll ? <div className={styles.fade}>&nbsp;</div> : null}
        </div>
        <div>
          <div id="displayAllBtn" className={styles.displayAllBtn} onClick={this.toggleDisplayAll}>
            {this.state.displayAll ? 'Collapse menu' : 'View full menu'}
          </div>
        </div>
      </div>
    );
  }
} 

export default Menu;

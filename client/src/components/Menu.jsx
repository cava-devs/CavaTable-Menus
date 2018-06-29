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
    this.time = 1;
    this.subMenusList = ['breakfast', 'lunch', 'dinner'];//
    this.getMenuObj();
    this.handleScroll();

    this.handleMenuBtnClick = this.handleMenuBtnClick.bind(this);
    this.handleFilterBtnClick = this.handleFilterBtnClick.bind(this);
    this.toggleDisplayAll = this.toggleDisplayAll.bind(this);
  }

  getMenuObj() {
    axios.get(`/menus/restaurant/${this.props.match.params.restaurantId}/menu/${this.time}`)
      .then(response => {
        let formatData = this.formatMenuData(response.data);
        let formatData2 = this.formatMenuData2(formatData);
        this.setState({
          menu: formatData2,
          selectedSubMenu: this.subMenusList[this.time - 1]
        });
      })
      .catch(err => console.error(err));
  }

  formatMenuData(arrayOfData) {
    let dishData = {};
    for (let i = 0; i < arrayOfData.length; i++) {
        let dish= arrayOfData[i];
        if (dishData[dish.menu_id]) {
            dishData[dish.menu_id].dietary_type[dish.dietary_type] = true;
        } else {
            dishData[dish.menu_id] = {
                name: dish.dish_name,
                desc: dish.dish_desc,
                price: dish.price,
                photoUrl: dish.photo_url,
                meal_time: dish.meal_time,
                section_name: dish.section_name,
                dietary_type: {}
            };
            dishData[dish.menu_id].dietary_type[dish.dietary_type] = true;
        }
    }
    let keys = Object.keys(dishData);
    let output = [];
    for (let k = 0; k < keys.length; k++) {
        let value = dishData[keys[k]];
        value['menu_id'] = keys[k];
        output.push(value);
    }
    return output;
  }

  formatMenuData2(arrayOfData) {
    let output = {
      rest_id: this.props.match.params.restaurantId,
      breakfast: [],
      lunch: [],
      dinner: []
    };
    let sections = {};
    for (let i = 0; i < arrayOfData.length; i++) {
      let sectionname = arrayOfData[i].section_name;
      sections[sectionname] = sections[sectionname] || [];
      sections[sectionname].push(arrayOfData[i]);
    }
    let menuSections = Object.keys(sections);
    if (this.time === 1) {
      for (let i = 0; i < menuSections.length; i++) {
        let temp = {
          menu_section: menuSections[i],
          entries: sections[menuSections[i]]
        };
        output.breakfast.push(temp);
      }
    } else if (this.time === 2) {
      for (let i = 0; i < menuSections.length; i++) {
        let temp = {
          menu_section: menuSections[i],
          entries: sections[menuSections[i]]
        };
        output.lunch.push(temp);
      }
    } else {
      for (let i = 0; i < menuSections.length; i++) {
        let temp = {
          menu_section: menuSections[i],
          entries: sections[menuSections[i]]
        };
        output.dinner.push(temp);
      }
    }
    return output;
  }

  handleMenuBtnClick(event) {
    let innerHTML = event.target.innerHTML.toLowerCase().replace(' ', '_');
    this.time = innerHTML === 'breakfast' ? 1 : innerHTML === 'lunch'? 2 : 3;
    //change breakfast/lunch/dinner here
    this.setState({
      selectedSubMenu: innerHTML,
    });
    this.getMenuObj();
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
      displayAllBtn.classList.add(styles.fixed);
    } else if (displayAllBtn.innerHTML === 'Collapse menu') {
      displayAllBtn.classList.remove(styles.fixed);
    }
    this.setState({
      displayAll: !this.state.displayAll,
    });
  }

  checkScrollPosition() {
    const menusModule = document.getElementById('menusModule');
    const displayAllBtn = document.getElementById('displayAllBtn');
    let scrollPosition = window.pageYOffset;
    let minHeight = menusModule.getBoundingClientRect().top + scrollPosition;
    let maxHeight = menusModule.offsetHeight * 0.65 + minHeight;
    if (minHeight >= scrollPosition || scrollPosition > maxHeight) {
      displayAllBtn.classList.remove(styles.fixed);
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
          <h3 className={styles['menu-title']}>Menu</h3>
          <div className={styles.menuBtnContainer}>
            {/* mapping breakfast, lunch and dinner buttons */}
            {this.subMenusList.map((subMenu, i) => {
              return <MenuButton name={subMenu} selectedSubMenu={this.state.selectedSubMenu} key={i} 
                      handleClick={this.handleMenuBtnClick} />;
            })}
            <FilterMenu filters={this.state.selectedFilters} handleClick={this.handleFilterBtnClick} />
          </div>
          <div id="menuContentContainer" className={styles.hidden}>
            {this.state.selectedSubMenu.length ?
            this.state.menu[this.state.selectedSubMenu].map((sectionObj, i) => {
              return <SubMenuSection sectionObj={sectionObj} filterObj={this.state.selectedFilters} key={i} />;
            }): null}
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

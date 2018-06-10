import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import _ from 'underscore';
import MenuButton from './MenuButton.jsx';
import SubMenuSection from './SubMenuSection.jsx';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {},
      selected: '',
      displayAll: false,
    };
    this.subMenusList = [];
    this.getMenuObj();
    this.handleScroll();

    this.handleMenuBtnClick = this.handleMenuBtnClick.bind(this);
    this.toggleDisplayAll = this.toggleDisplayAll.bind(this);
  }

  getMenuObj() {
    axios.get('/restaurant/1001/menu')
      .then(response => {
        this.findSubMenusList(response.data[0]);
        this.setState({
          menu: response.data[0],
          selected: this.subMenusList[0],
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
      selected: innerHTML,
    });
  }

  toggleDisplayAll() {
    $('#menuContentContainer').toggleClass('hidden');
    if ($('#displayAllBtn').html() === 'View full menu') {
      $('#displayAllBtn').addClass('fixed');
    } else if ($('#displayAllBtn').html() === 'Collapse menu') {
      $('#displayAllBtn').removeClass('fixed');
    }
    this.setState({
      displayAll: !this.state.displayAll,
    });
  }

  checkScrollPosition() {
    console.log('Firing!');
    let scrollPosition = $(document).scrollTop();
    let minHeight = $('#menu_module').position().top;
    let maxHeight = $('#menu_module').height() + minHeight;
    if (minHeight >= scrollPosition || scrollPosition > maxHeight) {
      $('#displayAllBtn').removeClass('fixed');
    }
  }

  handleScroll() {
    $(document).ready(() => {
      $(document).on('scroll', () => {
        if (this.state.displayAll) {
          _.debounce(this.checkScrollPosition, 300)();
        }
      });
    });
  }

  render() {
    return (
      <div className="card border-0 rounded-0">
        <div className="card-body">
          <h1 className="menu-title">Menu</h1>
          <div className="menuBtnContainer">
            {this.subMenusList.map((subMenu, i) => {
              return <MenuButton name={subMenu} selected={this.state.selected} key={i} 
                      handleClick={this.handleMenuBtnClick}/>;
            })}
          </div>
          <div id="menuContentContainer" className="hidden">
            {this.state.selected.length > 0 ? 
            this.state.menu[this.state.selected].map((sectionObj, i) => {
              return <SubMenuSection sectionObj={sectionObj} key={i} />;
            }) : null}
          </div>
          {!this.state.displayAll ? <div id="fade">&nbsp;</div> : null}
        </div>
        <div>
          <div id="displayAllBtn" onClick={this.toggleDisplayAll}>
            {this.state.displayAll ? 'Collapse menu' : 'View full menu'}
          </div>
        </div>
      </div>
    );
  }
} 

export default Menu;

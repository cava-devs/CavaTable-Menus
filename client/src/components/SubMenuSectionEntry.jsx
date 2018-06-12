import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

class SubMenuSectionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.handleMenuEntryClick = this.handleMenuEntryClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMenuEntryClick(event) {
    let image;
    // console.log(event.target.classList);
    if (this.state.isActive) {
      if (event.target.classList.contains('entryContainer')) {
        image = event.target.querySelector('.entryPhoto');
      } else {
        image = event.target.parentElement.querySelector('.entryPhoto');
      }
      image.classList.toggle('slideOut');
      // image.classList.toggle('slideIn');
      setTimeout(() => {
        this.setState({
          isActive: !this.state.isActive,
        });
      }, 1000);
    } else {
      this.setState({
        isActive: !this.state.isActive,
      });
    }
  }

  handleMouseLeave() {
    if (this.state.isActive) {
      this.setState({
        isActive: !this.state.isActive,
      });
    }
  }
  
  render() {
    return (
      <div className="card entryContainer" onClick={this.handleMenuEntryClick} onMouseLeave={this.handleMouseLeave}>
        <span className="entryName">{this.props.entry.name}</span>
        <div className="entryPrice">{this.props.entry.price}</div>
        <div className="entryDescription">{this.props.entry.desc}</div>
        {this.state.isActive ? (
          <img className="card-img-top entryPhoto slideIn" src={this.props.entry.photoUrl}></img>
        ) : null}
      </div>
    );
  }
}

SubMenuSectionEntry.propTypes = {
  entry: PropTypes.object,
};

export default SubMenuSectionEntry;


import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/SubMenuSectionEntry.css';


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
      if (event.target.classList.contains(styles.entryContainer)) {
        image = event.target.querySelector(`.${styles.entryPhoto}`);
      } else {
        image = event.target.parentElement.querySelector(`.${styles.entryPhoto}`);
      }
      image.classList.toggle(styles.slideOut);
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
      <div className={`card ${styles.entryContainer}`} onClick={this.handleMenuEntryClick} onMouseLeave={this.handleMouseLeave}>
        <span className={styles.entryName}>{this.props.entry.name}</span>
        <div className={styles.entryPrice}>{this.props.entry.price}</div>
        <div className={styles.entryDescription}>{this.props.entry.desc}</div>
        {this.state.isActive ? (
          <img className={`card-img-top ${styles.entryPhoto} ${styles.slideIn}`} src={this.props.entry.photoUrl}></img>
        ) : null}
      </div>
    );
  }
}

SubMenuSectionEntry.propTypes = {
  entry: PropTypes.object,
};

export default SubMenuSectionEntry;


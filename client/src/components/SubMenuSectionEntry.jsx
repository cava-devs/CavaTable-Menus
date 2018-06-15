import React from 'react';
import PropTypes from 'prop-types';
import { Motion, StaggeredMotion, spring } from 'react-motion';
import styles from '../styles/SubMenuSectionEntry.css';


class SubMenuSectionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
    this.initialLoad = true;
    this.handleMenuEntryClick = this.handleMenuEntryClick.bind(this);
    // this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMenuEntryClick(event) {
    let image;
    if (this.state.isActive) {
      if (event.target.classList.contains(styles.entryContainer)) {
        image = event.target.querySelector(`.${styles.entryPhoto}`);
      } else {
        image = event.target.parentElement.querySelector(`.${styles.entryPhoto}`);
      }
      // image.classList.toggle(styles.slideOut);
      // setTimeout(() => {
      //   this.setState({
      //     isActive: !this.state.isActive,
      //   });
      // }
      this.setState({
        isActive: !this.state.isActive,
      });
    } else {
      this.setState({
        isActive: !this.state.isActive,
      });
    }
  }

  // handleMouseLeave() {
  //   if (this.state.isActive) {
  //     this.setState({
  //       isActive: !this.state.isActive,
  //     });
  //   }
  // }

  // onClick={this.handleMenuEntryClick} onMouseLeave={this.handleMouseLeave}


  growMenuItem() {

  }
  
  render() {
    if (this.state.isActive) {
      return (
        <Motion
           defaultStyle={{scale: 1}}
           style={{scale: spring(1.2)}}
        >
        {
          style => (
            <div className={`${styles.entryContainer}`} style={{transform: `scale3d(${style.scale}, ${style.scale}, ${style.scale})`}} onClick={this.handleMenuEntry}>
                <span className={styles.entryName}>{this.props.entry.name}</span>
                <div className={styles.entryPrice}>{this.props.entry.price}</div>
                <div className={styles.entryDescription}>{this.props.entry.desc}</div>
                {this.state.isActive ? (
                  <img className={`${styles.entryPhoto} ${styles.slideIn}`} src={this.props.entry.photoUrl}></img>
                ) : null}
              {/* </div> */}
            </div>
          )
        }
        </Motion>
      );
    } else if (!this.state.isActive && !this.initialLoad) {
      return (
        <Motion
            defaultStyle={{scale: 1.2}}
            style={{scale: spring(1)}}
        >
        {
          style => (
            <div className={`${styles.entryContainer}`} style={{transform: `scale3d(${style.scale}, ${style.scale}, ${style.scale})`}} >
              {/* <div style={{transform: `scaleY(1 - ${style.scale} / 2`}}> */}
                <span className={styles.entryName}>{this.props.entry.name}</span>
                <div className={styles.entryPrice}>{this.props.entry.price}</div>
                <div className={styles.entryDescription}>{this.props.entry.desc}</div>
                {this.state.isActive ? (
                  <img className={`${styles.entryPhoto} ${styles.slideIn}`} src={this.props.entry.photoUrl}></img>
                ) : null}
              {/* </div> */}
            </div>
          )
        }
        </Motion>
      );
    } else if (this.state.isActive && this.initialLoad) {
      return (
        <div className={`${styles.entryContainer}`} >
            <span className={styles.entryName}>{this.props.entry.name}</span>
            <div className={styles.entryPrice}>{this.props.entry.price}</div>
            <div className={styles.entryDescription}>{this.props.entry.desc}</div>
            {this.state.isActive ? (
              <img className={`${styles.entryPhoto} ${styles.slideIn}`} src={this.props.entry.photoUrl}></img>
            ) : null}
          {/* </div> */}
        </div>
      );
    }
  }
}

SubMenuSectionEntry.propTypes = {
  entry: PropTypes.object,
};

export default SubMenuSectionEntry;


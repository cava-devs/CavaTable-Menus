import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import { UnmountClosed as Collapse } from 'react-collapse';
import styles from '../styles/SubMenuSectionEntry.css';


class SubMenuSectionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isHovered: false,
    };
    this.handleMenuEntryClick = this.handleMenuEntryClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  handleMenuEntryClick() {
    this.setState({
      isActive: !this.state.isActive,
    });
  }

  handleMouseEnter() {
    this.setState({
      isHovered: !this.state.isHovered,
    });
  }

  handleMouseLeave() {
    if (this.state.isActive) {
      this.setState({
        isActive: !this.state.isActive,
        isHovered: !this.state.isHovered,
      });
    } else {
      this.setState({
        isHovered: !this.state.isHovered,
      });
    }
  }

  render() {
    return (
      <Motion defaultStyle={{translateX: 0}} style={{translateX: spring(7, {stiffness: 180, damping: 6})}}>
        {style => {
          return this.state.isHovered ? (
            <div className={styles.entryContainer} style={{transform: `translateX(${style.translateX}px)`}} onClick={this.handleMenuEntryClick} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
              <Collapse isOpened={this.state.isActive} theme={{collapse: styles.collapseContainer, content: styles.menuImgContainer}} springConfig={{stiffness: 180, damping: 18}}
                        onRest={this.transitionOpacity}          
              >
                <img className={styles.entryPhoto} src={this.props.entry.photoUrl}></img>
              </Collapse> 
              <div onClick={this.handleMenuEntryClick}>
                <span className={styles.entryName}>{this.props.entry.name}</span>
                <div className={styles.entryPrice}>{this.props.entry.price}</div>
                <div className={styles.entryDescription}>{this.props.entry.desc}</div>
              </div>
            </div>
          ) : (
            <div className={styles.entryContainer} onClick={this.handleMenuEntryClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
              <Collapse isOpened={this.state.isActive} theme={{collapse: styles.collapseContainer, content: styles.menuImgContainer}} springConfig={{stiffness: 180, damping: 18}}>
                <img className={styles.entryPhoto} src={this.props.entry.photoUrl}></img>
              </Collapse> 
              <div onClick={this.handleMenuEntryClick}>
                <span className={styles.entryName}>{this.props.entry.name}</span>
                <div className={styles.entryPrice}>{this.props.entry.price}</div>
                <div className={styles.entryDescription}>{this.props.entry.desc}</div>
              </div>
            </div>
          );
        }}
      </Motion>
    );
  }
}

SubMenuSectionEntry.propTypes = {
  entry: PropTypes.object,
};

export default SubMenuSectionEntry;


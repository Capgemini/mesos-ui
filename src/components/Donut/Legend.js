'use strict';
/*jshint esnext: true */
import React from 'react';

class Legend extends React.Component {

  static propTypes = {
    item: React.PropTypes.object,
    color: React.PropTypes.string
  };

  getStyles() {
    let styles = {
      itemName: {
        color: this.props.color
      },
      itemCount: {
        marginRight: 5
      }
    };
    return styles;
  }

  render() {
    let item = this.props.item;
    let styles = this.getStyles();

    return (
      <div>
        <strong style={styles.itemCount}>{item.count}</strong>
        <span style={styles.itemName} >{item.name}</span>
      </div>
    );
  }
}

export default Legend;

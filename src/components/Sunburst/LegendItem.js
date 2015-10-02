import React, { PropTypes } from 'react';

class LegendItem extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    used: PropTypes.number,
    total: PropTypes.number,
    color: PropTypes.string
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };

  getStyles() {
    let color = this.props.color;
    return {
      root: {
        listStyle: 'none',
        marginBottom: 5
      },
      title: {
        float: 'left',
        width: 60
      },
      img: {
        float: 'left',
        marginRight: 5,
        backgroundColor: color,
        width: 20,
        height: 20
      }
    };
  }

  render() {
    let props = this.props;
    let title = props.title;
    let used = props.used;
    let total = props.total;
    let styles = this.getStyles();

    return (
      <li style={styles.root}>
        <img style={styles.img}/><span style={styles.title}>{title}</span> <span>{used} / {total}</span>
      </li>
    );
  }
}

export default LegendItem;

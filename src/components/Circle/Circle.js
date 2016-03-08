import React, { PropTypes } from 'react';

class Circle extends React.Component {

  static propTypes = {
    radius: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      background: 'radial-gradient(' + this.props.color +' 5%, hsla(0, 100%, 20%, 0) 90%) 0 0',
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: this.props.radius,
      margin: 3,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: this.props.color,
      float: 'left'
    };
    return (<div style={style}></div>);
  }
}

export default Circle;

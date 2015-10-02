import React, { PropTypes } from 'react';

class PageTitle extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired
  };

  /* @todo - allow overridable styles */
  getStyles() {
    let styles = {
      fontWeight: 100,
      marginBottom: 20
    };
    return styles;
  }

  render() {
    let title = this.props.title;
    let styles = this.getStyles();

    return (
      <h1 style={styles}>{title}</h1>
    );
  }
}

export default PageTitle;

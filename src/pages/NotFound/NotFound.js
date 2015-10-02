import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';

class NotFound extends React.Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Page Not Found';
    this.context.onSetTitle(title);
    return (
      <div>
        <PageTitle title={title} />
        <p>Sorry, but the page you were trying to view does not exist.</p>
      </div>
    );
  }

}

export default NotFound;

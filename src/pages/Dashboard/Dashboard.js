import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';

class Dashboard extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Dashboard';
    this.context.onSetTitle(title);
    return (
      <div>
        <PageTitle title={title} />
      </div>
    );
  }

}

export default Dashboard;

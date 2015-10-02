import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';

class Nodes extends React.Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Nodes';
    this.context.onSetTitle(title);

    return (
      <div>
        <PageTitle title={title} />
      </div>
    );
  }

}

export default Nodes;

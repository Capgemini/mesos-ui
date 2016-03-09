import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
import DashboardBox from '../../components/DashboardBox';
import Sunburst from '../../components/Sunburst';

class Nodes extends React.Component {

  static propTypes = {
    nodes: PropTypes.array.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Nodes';
    let nodes = this.props.nodes;

    let widgets = nodes.map(function(node, i){
      return React.createElement(DashboardBox, { title: node.hostname },
        React.createElement(Sunburst, { key: i, totalResources: node.resources, usedResources: node.usedResources })
      );
    });

    this.context.onSetTitle(title);

    return (
      <div>
        <PageTitle title={title} />
        <div className="row">
          { widgets }
        </div>
      </div>
    );
  }

}

export default Nodes;

import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
import DashboardBox from '../../components/DashboardBox';
import FrameworkBlock from '../../components/FrameworkBlock';

class Frameworks extends React.Component {

  static propTypes = {
    frameworks: PropTypes.array.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Frameworks';
    let frameworks = this.props.frameworks;
    this.context.onSetTitle(title);

    let widgets = frameworks.map(function(framework, i){
      return React.createElement(DashboardBox, { styles: { root: { minHeight: 'auto' } }, key: i, title: framework.name, xsColSize: 6, smColSize: 4, mdColSize: 3 },
        React.createElement(FrameworkBlock, { key: i, name: framework.name, url: framework.webuiUrl, tasks: framework.tasks.length })
      );
    });

    return (
      <div>
        <PageTitle title={title} />
        <div className="row">
          {widgets}
        </div>
      </div>
    );
  }

}

export default Frameworks;

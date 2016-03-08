import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
//import DashboardBox from '../../components/DashboardBox';
//import Sunburst from '../../components/Sunburst';

class Logs extends React.Component {

  static propTypes = {
    logs: PropTypes.object.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  getStyles() {

    let style = {
      logs: {
        border: 0,
        borderWidth: 0,
        overflow: 'auto',
        height: '500'
      }
    };
    return style;
  }
  render() {
    let style = this.getStyles();
    let title = 'Master Logs';
    let logs = this.props.logs;
    this.context.onSetTitle(title);

    return (
      <div>
        <PageTitle title={title} />
        <div className="logs-box">
          <pre style={style.logs}>
          { logs['data'] }
          </pre>
        </div>
      </div>
    );
  }

}

export default Logs;

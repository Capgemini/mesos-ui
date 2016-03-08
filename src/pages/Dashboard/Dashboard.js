import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
import DashboardBox from '../../components/DashboardBox';
import Donut from '../../components/Donut';
import ClusterStore from '../../stores/ClusterStore';
import _ from 'lodash';

class Dashboard extends React.Component {

  static propTypes = {
    nodes: PropTypes.array.isRequired,
    frameworks: PropTypes.array.isRequired,
    stats: PropTypes.object.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  cpuStats() {
    let stats = this.props.stats;
    let cpuFree = stats.cpusTotal - stats.cpusUsed;
    return ([
      {name: 'Used', count: _.round(stats.cpusUsed, 2), color: 'deepPurple'},
      {name: 'Free', count: _.round(cpuFree, 2), color: 'grey'}
    ]);
  }

  memoryStats() {
    let stats = this.props.stats;
    let memoryFree = stats.memTotal - stats.memUsed;
    return ([
      {name: 'Used', count: ClusterStore.convertMBtoGB(stats.memUsed), color: 'cyan'},
      {name: 'Free', count: ClusterStore.convertMBtoGB(memoryFree), color: 'grey'}
    ]);
  }

  diskStats() {
    let stats = this.props.stats;
    let diskFree = stats.diskTotal - stats.diskUsed;
    return ([
      {name: 'Used', count: ClusterStore.convertMBtoGB(stats.diskUsed), color: 'orange'},
      {name: 'Free', count: ClusterStore.convertMBtoGB(diskFree), color: 'grey'}
    ]);
  }

  taskStats() {
    let stats = this.props.stats;
    return ([
      {name: 'Running', count: stats.tasksRunning, color: 'green'},
      {name: 'Staged', count: stats.tasksStaging, color: 'amber'}
    ]);
  }

  nodeStats() {
    let stats = this.props.stats;
    return ([
      {name: 'Connected', count: stats.slavesConnected, color: 'green'},
      {name: 'Disconnected', count: stats.slavesDisconnected, color: 'red'}
    ]);
  }

  render() {
    let title = 'Dashboard';
    this.context.onSetTitle(title);
    return (
      <div>
        <PageTitle title={title} />
        <div className="row">
          <DashboardBox title="CPU Usage">
            <Donut title="Total CPUs" data={this.cpuStats()} />
          </DashboardBox>

          <DashboardBox title="Memory Usage">
            <Donut title="Total Memory (GB)" data={this.memoryStats()} />
          </DashboardBox>

          <DashboardBox title="Disk Usage">
            <Donut title="Total Disk (GB)" data={this.diskStats()} />
          </DashboardBox>

          <DashboardBox title="Tasks">
            <Donut title="Total Tasks" data={this.taskStats()} />
          </DashboardBox>

          <DashboardBox title="Nodes">
            <Donut title="Total Nodes" data={this.nodeStats()} />
          </DashboardBox>
        </div>
      </div>
    );
  }

}

export default Dashboard;

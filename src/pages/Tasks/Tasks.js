/*jshint esnext: true */

import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
import TaskTable from '../../components/TaskTable';
import TaskVisualizer from '../../components/TaskVisualizer';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

class Tasks extends React.Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    };

    let title = 'Tasks';
    this.context.onSetTitle(title);
    return (
      <div>
        <PageTitle title={title} />
        <Tabs>
          <Tab label="Table" >
            <div>
              <TaskTable tasks={this.props.tasks} />
            </div>
          </Tab>
          <Tab label="Visualizer" >
            <div>
              <TaskVisualizer tasks={this.props.tasks} />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Tasks;

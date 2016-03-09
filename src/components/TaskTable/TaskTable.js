import React, { PropTypes } from 'react';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';

class TaskTable extends React.Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired
  };

  constructor() {
    super();
    this.state = {
      parameterToOrderBy: 'timestamp',
    };
  }

  setParameterToOrderBy(e) {
    this.setState({parameterToOrderBy: e.target.value});
  }

  orderTasksByParameter(tasks = [], parameterToOrderBy = 'timestamp') {
    var parameter = parameterToOrderBy;
    tasks.sort(function(a, b) {
      if (a[parameter] < b[parameter]) {
        return 1;
      }
      if (a[parameter] > b[parameter]) {
        return -1;
      }
      return 0;
    });
    return tasks;
  }

  renderOrderBox() {
    // We Can't just order on table header clicks due to:
    //https://github.com/callemall/material-ui/issues/1783
    //https://github.com/callemall/material-ui/issues/2011
    return(
      <div style={this.getStyles().orderBox}>
        <span>Order tasks by:</span>
        <RadioButtonGroup ref="orderByRadioButtonGroup" name="orderByRadioButtonGroup" valueSelected={this.state.parameterToOrderBy} onChange={this.setParameterToOrderBy.bind(this)}>
          <RadioButton
            ref="orderByTime"
            value="timestamp"
            label="Up time"
            style={this.getStyles().radioButton}
          />
          <RadioButton
            ref="orderById"
            value="id"
            label="ID"
            style={this.getStyles().radioButton}
          />
          <RadioButton
            ref="orderByHost"
            value="hostname"
            label="Host"
            style={this.getStyles().radioButton}
          />
        </RadioButtonGroup>
      </div>
    );
  }

  getStyles() {
    return {
      radioButton: {
        width: 150,
        float: 'left'

      },
      orderBox: {
        height: 30,
        padding: 20
      }
    };
  }

  //http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
  timeSince(date) {

    var seconds = Math.floor((new Date() - date*1000) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }


  render() {

    let tasks = this.props.tasks.slice();
    let orderedTasks = this.orderTasksByParameter(tasks, this.state.parameterToOrderBy);
    return (
      <div>
        {this.renderOrderBox()}
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow displayRowCheckbox={false} selectable={true}>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Up time</TableHeaderColumn>
              <TableHeaderColumn>Framework</TableHeaderColumn>
              <TableHeaderColumn>Host</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} selectable={false}>
            {orderedTasks.map((task) =>
              <TableRow key={task.id}>
                <TableRowColumn>{task.id}</TableRowColumn>
                <TableRowColumn>{task.name}</TableRowColumn>
                <TableRowColumn>{task.state}</TableRowColumn>
                <TableRowColumn>{this.timeSince(task.timestamp)}</TableRowColumn>
                <TableRowColumn>{task.framework_name}</TableRowColumn>
                <TableRowColumn>{task.hostname}</TableRowColumn>
              </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default TaskTable;


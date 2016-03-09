/*jshint esnext: true */

import React, { PropTypes } from 'react';
import Circle from '../Circle';
import { List, ListItem } from 'material-ui/lib/lists';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';

class TaskVisualizer extends React.Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.state = {
      parameterToGroupBy: 'name',
      toggleAppList: {}
    };
  }

  groupBy(e) {
    this.setState({parameterToGroupBy: e.target.value});
  }

  stringToColour(str) {
    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    // int/hash to hex
    for (var i = 0, colour = '#'; i < 3; colour += ('00' + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
  }

  // Return a hash appName: HEX_color_value
  createAppColorList(tasks) {
    let appColorList = {};
    for(var index in tasks) {
      let appName = tasks[index].name;
      appColorList[appName] = this.stringToColour(appName);
    }
    return appColorList;
  }

  // Keeps track of toggleAppList.
  toggleApp(name, e) {
    let newStateToggleAppList = this.state.toggleAppList
    newStateToggleAppList[name] = !this.state.toggleAppList[name];
    this.setState({toggleAppList: newStateToggleAppList});
  }

  renderAppColorLegend(appColorList) {

    let appColorListRendered = [];

    for (var name in appColorList) {
      appColorListRendered.push(
        <div style={this.getStyles(appColorList[name]).taskLegendBox}>
          <Circle color={appColorList[name]} radius={40} />
          <Toggle toggled={!this.state.toggleAppList[name]} onToggle={this.toggleApp.bind(this, name)} />
          {name}
        </div>
      );
    }

    return (
      <div>
        <List>
          <ListItem
            primaryText="Apps Legend."
          />
          {appColorListRendered}
        </List>
      </div>
    );
  }

  excludeToggledTasks() {
    let tasks = [];
    for (var index in this.props.tasks) {
      let name = this.props.tasks[index].name;
      if (!this.state.toggleAppList[name]) {
        tasks.push(this.props.tasks[index]);
      }
    }
    return tasks;
  }

  createCirclesInGroupsList() {

    let tasks = this.excludeToggledTasks();
    let appColorList = this.createAppColorList(tasks);
    let circlesList = {};
    let key = 0;

    for (var index in tasks ) {
      let name = tasks[index].name;
      let id = tasks[index].id
      let color = appColorList[name];
      let parameterToGroupByValue = tasks[index][this.state.parameterToGroupBy]

      circlesList[parameterToGroupByValue] = circlesList[parameterToGroupByValue] || [];
      circlesList[parameterToGroupByValue].push(<Circle className={name} key={id} color={color} radius={70} />);
    }

    return circlesList
  }

  renderCirclesInGroups(circlesList) {
    let groupCirclesList = []
    for (var parameterToGroupByValue in circlesList) {
      groupCirclesList.push(<div style={this.getStyles().circleBox} className={parameterToGroupByValue}><div>{parameterToGroupByValue}</div>{circlesList[parameterToGroupByValue]}</div>);
    }
    return groupCirclesList;
  }

  getStyles(color) {
    return {
      taskLegendBox: {
        margin: 20,
        float: 'left'
      },
      circleBox: {
        width: 270,
        margin: 10,
        float: 'left'
      },
      radioButton: {
        marginBottom: 16,
      }
    };
  }

  render() {

    let tasks = this.props.tasks
    return (
      <div>
        {this.renderAppColorLegend(this.createAppColorList(tasks))}
        <div>
          <RadioButtonGroup ref="groupByRadioButtonGroup" name="groupByRadioButtonGroup" defaultSelected="name" valueSelected={this.state.parameterToGroupBy} onChange={this.groupBy.bind(this)}>
            <RadioButton
              ref="groupByAppName"
              value="name"
              label="Group by App."
              style={this.getStyles().radioButton}
            />
            <RadioButton
              ref="groupBySlave"
              value="hostname"
              label="Group by Host."
              style={this.getStyles().RadioButton}
            />
          </RadioButtonGroup>
        </div>
        <ul>
          {this.renderCirclesInGroups(this.createCirclesInGroupsList())}
        </ul>
      </div>
    );
  }
}

export default TaskVisualizer;

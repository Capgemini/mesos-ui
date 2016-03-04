/*jshint esnext: true */

import React, { PropTypes } from 'react';
import PageTitle from '../../components/PageTitle';
import DashboardBox from '../../components/DashboardBox';
import Sunburst from '../../components/Sunburst';
import { Motion, spring } from 'react-motion';
import random from 'lodash/number/random';
import range from 'lodash/utility/range';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';

class Circle extends React.Component {
  render() {
    const style = (x, y) => ({
      background: 'radial-gradient(' + this.props.color +' 0%, hsla(0, 100%, 20%, 0) 100%) 0 0',
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: this.props.radius,
      position: 'absolute',
      left: x,
      top: y
    });

    let currentX = this.props.x
    return (<Motion defaultStyle={{x: random(0,600), y: random(0,600)}} style={{x: spring(random(currentX,currentX+600), [10, 57]), y: spring(random(100,600), [10, 57])}}>
        { interpolated => <div style={ style(interpolated.x, interpolated.y) }></div>}
      </Motion>
    );
  }
}

export default class Maintenance extends React.Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.state = {
      score: 0,
      parameterToGroupBy: 'name',
      toggleAppList: {}
    };
    setInterval(() => { this.forceUpdate(); }, 1000);
  }

  stringToColour(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    // int/hash to hex
    for (var i = 0, colour = '#'; i < 3; colour += ('00' + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
  }

  createAppColorList() {

    let tasks = this.props.tasks;
    let appColorList = {};
    for(var index in tasks) {
      appColorList[tasks[index].name] = this.stringToColour(tasks[index].name);
    }
    return appColorList;
  }

  createTaskPositionByProperty(tasks, property = 'slave_id') {

    let taskPositionList = {};
    let currentPosition = 0
    for(var index in tasks) {
      if (taskPositionList[tasks[index][property]] == null) {
        taskPositionList[tasks[index][property]] = currentPosition;
        currentPosition = currentPosition+600;
      }
    }
    return taskPositionList;
  }

  toggleApp(name, e) {
    // Consider 0 as enable so we can initialize all on by "toggled={!this.state.toggleAppList[name]}"
    this.state.toggleAppList[name] = !this.state.toggleAppList[name];
  }

  renderAppColorList(appColorList) {
    let appColorListRendered = [];
    for (var name in appColorList) {
      appColorListRendered.push(<ListItem key={name} style={this.getStyles(appColorList[name])} primaryText={name} rightToggle={<Toggle toggled={!this.state.toggleAppList[name]} onToggle={this.toggleApp.bind(this, name)} />} />);
    }

    return appColorListRendered;
  }

  renderCircles() {
    //TODO: this should be in props only run when change.?
    let tasks = [];
    for (var index in this.props.tasks) {
      let name = this.props.tasks[index].name;
      if (!this.state.toggleAppList[name]) {
        tasks.push(this.props.tasks[index]);
      }
    }
    let colorList = this.createAppColorList();
    let positionList = this.createTaskPositionByProperty(tasks, this.state.parameterToGroupBy);
    let circlesList = []
    let key = 0

    for (var index in tasks ) {
      let name = tasks[index].name;
      let color = colorList[name];
      let parameterToGroupByValue = tasks[index][this.state.parameterToGroupBy]
      let position = positionList[parameterToGroupByValue];
      circlesList.push(<Circle className={name} key={key} color={color} radius={75} x={position} y={random(10, window.document.body.clientHeight)} />)
      key = key+1;
    }
    return circlesList
  }

  getStyles(color) {
    return {
      float: 'left',
      marginRight: 5,
      background: 'radial-gradient(' + color + ' 0%, hsla(0, 100%, 20%, 0) 100%) 0 0',
      width: 25,
      height: 75,
      borderRadius: 95,
    };
  }

  groupBy(e) {
    this.setState({parameterToGroupBy: e.target.value});
  }

  render() {

    const styles = {
      block: {
        maxWidth: 250,
      },
      radioButton: {
        marginBottom: 16,
      },
    };

    return (
      <div>
        <div>
            <List>
              <ListItem
                primaryText="Tasks Legend."
              />
              {this.renderAppColorList(this.createAppColorList())}
            </List>
        </div>
        <div>
          <RadioButtonGroup ref="groupByRadioButtonGroup" name="groupByRadioButtonGroup" defaultSelected="name" valueSelected={this.state.parameterToGroupBy} onChange={this.groupBy.bind(this)}>
            <RadioButton
              ref="groupByAppName"
              value="name"
              label="Group by App."
              style={styles.radioButton}
            />
            <RadioButton
              ref="groupBySlave"
              value="slave_id"
              label="Group by Slave."
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>
        <ul>
          {this.renderCircles()}
        </ul>
      </div>
    );
  }
}

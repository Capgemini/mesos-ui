import React, { PropTypes } from 'react';
import { Styles, Utils } from 'material-ui';
let { Colors } = Styles;
import _ from 'lodash';
import LegendItem from './LegendItem.js';

class Legend extends React.Component {
  static propTypes = {
    totalResources: PropTypes.object.isRequired,
    usedResources: PropTypes.object.isRequired,
    colors: PropTypes.object
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  };

  static defaultProps = {
    colors: {
      cpus: Colors.deepPurple700, /* @todo pull this from the theme */
      mem: Colors.cyan500,
      disk: Colors.orange500
    }
  };

  getTitleMapping(key) {
    let titles = {
      cpus: 'CPU',
      disk: 'Disk',
      mem: 'Memory'
    };

    return titles[key];
  }

  render() {
    let props = this.props;
    let totalResources = _.omit(props.totalResources, 'ports', 'ephemeral_ports');
    let usedResources = _.omit(props.usedResources, 'ports', 'ephemeral_ports');
    let legendItems = [];
    let _this = this; //eslint-disable-line

    _.forIn(totalResources, function(value, key) {
      legendItems.push(React.createElement(LegendItem, {key: key, title: _this.getTitleMapping(key),
        color: props.colors[key], total: value, used: usedResources[key] }));
    });

    return (
      <div>
        {legendItems}
      </div>
    );
  }
}

export default Legend;

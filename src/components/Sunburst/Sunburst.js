'use strict';
/*jshint esnext: true */
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
import Legend from './Legend.js';
import { Styles, Utils } from 'material-ui';
let { Colors } = Styles;
let { ColorManipulator } = Utils;

class Sunburst extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    totalResources: React.PropTypes.object.isRequired,
    usedResources: React.PropTypes.object.isRequired,
    colors: React.PropTypes.object,
    transitionDuration: React.PropTypes.number
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static defaultProps = {
    width: 200,
    height: 200,
    data: [],
    transitionDuration: 1000,
    colors: {
      cpus: '#512DA8', /* @todo pull this from the theme */
      mem: '#00BCD4',
      disk: '#FF9800',
      canvas: ColorManipulator.fade(Colors.darkBlack, 0.1)
    }
  };

  constructor(props) {
    super(props);
    this.drawInitialComponent = this.drawInitialComponent.bind(this);
    this.arcTween = this.arcTween.bind(this);
    this.updateDonuts = this.updateDonuts.bind(this);
    this.paths = [];
    this.arcs = [];
  }

  componentDidMount() {
    this.drawInitialComponent(this.props);
  }

  shouldComponentUpdate(nextProps) {
    this.updateDonuts(nextProps);
    // skips react render() function.
    return false;
  }

  arcTween(transition, newAngle, arc) {
    transition.attrTween('d', function(d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle);
      return function(t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    });
  }

  drawInitialComponent(props) {
    let twoPie = 2 * Math.PI;
    let totalResources = _.omit(props.totalResources, 'ports', 'ephemeral_ports');
    let usedResources = _.omit(props.usedResources, 'ports', 'ephemeral_ports');
    let outerRadius = props.width / 2.;
    let innerRadius = props.width / 2.24;
    let radiusDifference = 12;
    let index = 0;
    let _this = this; //eslint-disable-line
    let colors = this.props.colors;
    let canvasColour = colors.canvas;

    let svg = d3.select(React.findDOMNode(this.refs.svg))
      .append('g')
      .attr('transform', 'translate(' + (props.width) / 2 + ',' + (props.height) / 2 + ')');

    // Loop through each resource and compute a pie chart for it.
    _.forIn(totalResources, function(value, key) {

      _this.arcs[key] = d3.svg.arc()
        .outerRadius(outerRadius - (index * radiusDifference))
        .innerRadius(innerRadius - (index * radiusDifference))
        .startAngle(0);

      // background path fill.
      svg.append('path')
        .datum({endAngle: twoPie})
        .style('fill', canvasColour)
        .attr('class', key)
        .attr('d', _this.arcs[key]);

      let linearScale = d3.scale.linear().domain([0, value]);
      let newAngle = linearScale(usedResources[key]) * twoPie;

      // foreground path fill.
      _this.paths[key] = svg.append('path')
        .datum({endAngle: newAngle})
        .style('fill', colors[key])
        .attr('d', _this.arcs[key]);

      index++;
    });
  }

  updateDonuts(props) {
    let twoPie = 2 * Math.PI;
    let totalResources = _.omit(props.totalResources, 'ports', 'ephemeral_ports');
    let usedResources = _.omit(props.usedResources, 'ports', 'ephemeral_ports');
    let transitionDuration = props.transitionDuration;
    let _this = this; //eslint-disable-line

    // Loop through each resource update the donut for each.
    _.forIn(totalResources, function(value, key) {

      // This calculates the percent value (e.g. 0.25 for 25%) for the arc
      let linearScale = d3.scale.linear().domain([0, value]);
      let newAngle = linearScale(usedResources[key]) * twoPie;

      // transition to the new angle.
      _this.paths[key].transition()
        .duration(transitionDuration)
        .call(_this.arcTween, newAngle, _this.arcs[key]);
    });
  }

  render() {
    let props = this.props;

    return (
      <div>
        <div className="center-xs">
          <svg ref="svg" width={props.width} height={props.height}>
          </svg>
        </div>
        <div className="left-xs" style={{ paddingLeft: 16, paddingBottom: 16 }}>
          <Legend usedResources={props.usedResources} totalResources={props.totalResources} />
        </div>
      </div>
    );
  }
}

export default Sunburst;

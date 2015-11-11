'use strict';
/*jshint esnext: true */
import React from 'react';
import d3 from 'd3';
import { Styles } from 'material-ui';
let { Colors } = Styles;
import Legend from './Legend';
import _ from 'lodash';

class Donut extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    colors: React.PropTypes.object,
    transitionDuration: React.PropTypes.number
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static defaultProps = {
    width: 200,
    height: 200,
    title: '',
    data: [],
    transitionDuration: 1000,
    colors: {
      green: Colors.green500,
      red: Colors.red500,
      amber: Colors.amber500
    }
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.drawInitialComponent = this.drawInitialComponent.bind(this);
  }

  componentDidMount() {
    let props = this.props;
    let data = props.data;

    // If we have data draw the donut.
    if(data.filter(function(d) { return d.count > 0; }).length > 0) {
      this.drawInitialComponent(props);
    }
  }

  shouldComponentUpdate(nextProps) {
    let oldValues = this.props.data.map(function(item){
      return item.count;
    });
    let newValues = nextProps.data.map(function(item){
      return item.count;
    });

    if (!(_.isEqual(oldValues, newValues))) {
      this.update(nextProps);
      return false;
    }
    return true;
  }

  getDonutLegend() {
    let data = this.props.data;
    let colors = this.props.colors;
    return data.map(function(item, i){
      return React.createElement(Legend, { key: i, color: colors[item.color], item: item });
    });
  }

  drawInitialComponent(props) {
    let colors = props.colors;
    let data = props.data;
    let paperColour = this.context.muiTheme.component.paper.backgroundColor;
    let transitionDuration = props.transitionDuration;

    let color = data.map(function(item){
      return colors[item.color];
    });

    let svg = d3.select(React.findDOMNode(this.refs.svg))
      .append('g')
      .attr('transform', 'translate(' + (props.width) / 2 + ',' + (props.height) / 2 + ')');

    let d3Colors = d3.scale.ordinal().range(color);
    let outerRadius = props.width / 2.1;
    let innerRadius = props.width / 2;
    let arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    let pie = d3.layout.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    this.path = svg.datum(data).selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('fill', function(d, i) { return d3Colors(i); })
      .attr('d', arc)
      .each(function(d) {
        this.current = d;
      });

    this.path.transition()
      .ease('exp')
      .duration(transitionDuration)
      .attrTween('d', function(b) {
        var i = d3.interpolate({startAngle: 1.1 * Math.PI, endAngle: 1.1 * Math.PI}, b);
        return function(t) {
          return arc(i(t));
        };
      });

    // only draw a stroke around the arcs if we have 2 data points that have a
    // count greater than zero. Otherwise we draw a stroke round a full arc
    // which displays a bit odd.
    if(data.filter(function(d) { return d.count > 0; }).length > 1) {
      this.path.style('stroke', paperColour);
    }
  }

  update(props) {
    let data = props.data;
    let width = props.width;
    let transitionDuration = props.transitionDuration;
    let paperColour = this.context.muiTheme.component.paper.backgroundColor;
    let outerRadius = width / 2.1;
    let innerRadius = width / 2;
    let arc = d3.svg.arc().outerRadius(outerRadius).innerRadius(innerRadius);

    let pie = d3.layout.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    // Check if we've already drawn the component.
    if (typeof this.path === 'undefined') {
      this.drawInitialComponent(props);
    } else {
      // Compute the new angles and do the transition.
      this.path.data(pie(data))
      .transition()
      .duration(transitionDuration)
      .ease('exp')
      .attrTween('d', function arcTween(a) {
        var i = d3.interpolate(this.current, a);
        this.current = i(0);
        return function(t) {
          return arc(i(t));
        };
      });

      // only draw a stroke around the arcs if we have 2 data points that have a
      // count greater than zero. Otherwise we draw a stroke round a full arc
      // which displays a bit odd.
      if(data.filter(function(d) { return d.count > 0; }).length > 1) {
        this.path.style('stroke', paperColour);
      }
      else {
        this.path.style('stroke', 'none');
      }
    }
  }

  getStyles() {
    return {
      largeText: {
        fontSize: 30
      },
      smallText: {
        fontSize: 15
      }
    };
  }

  render() {
    let props = this.props;
    let data = props.data;

    let styles = this.getStyles();
    let palette = this.context.muiTheme.palette;
    let title = props.title;
    let result = data.map(function(item){
      return item.count;
    });
    let sum = result.reduce(function(memo, num){
      return _.round(memo + num, 2);
    }, 0);
    let position = 'translate(' + (props.width) / 2 + ',' + (props.height) / 2 + ')';

    return (
      <div>
        <div className="center-xs">
          <svg ref="svg" width={props.width} height={props.height}>
            <g transform={position}>
              <text fill={palette.textColor} style={styles.largeText} textAnchor="middle">{sum}</text>
              <text fill={palette.textColor} y="20" style={styles.smallText} textAnchor="middle">{title}</text>
            </g>
          </svg>
        </div>
        <div className="left-xs" style={{ paddingLeft: 16, paddingBottom: 16 }}>
          {this.getDonutLegend()}
        </div>
      </div>
    );
  }
}

export default Donut;

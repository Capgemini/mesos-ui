/*jshint esnext: true */
import React from 'react';
import { RouteHandler } from 'react-router';
import withContext from '../../decorators/withContext';
import mui, { FontIcon } from 'material-ui';
import Logo from '../Logo';
import Navigation from '../Navigation';
import Radium from 'radium';
import ClusterStore from '../../stores/ClusterStore';
import {Motion, spring} from 'react-motion';

let ThemeManager = new mui.Styles.ThemeManager();

@withContext
@Radium
class App extends React.Component {

  static propTypes = {
    navMedium: React.PropTypes.number,
    navSmall: React.PropTypes.number,
    motionStiffness: React.PropTypes.number,
    motionDamping: React.PropTypes.number
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  static defaultProps = {
    navMedium: 170,
    navSmall: 64,
    motionStiffness: 390,
    motionDamping: 35
  };

  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      stats: ClusterStore.getStats(),
      logs: ClusterStore.getLogs(),
      frameworks: ClusterStore.getFrameworks(),
      nodes: ClusterStore.getNodes()
    };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    ClusterStore.addChangeListener(this.refreshStats.bind(this));
    ClusterStore.addChangeListener(this.refreshLogs.bind(this));
    ClusterStore.addChangeListener(this.refreshState.bind(this));

    // Setup socket connections. We use the global io() object here which
    // should be available in the browser.
    this.socket = io(); //eslint-disable-line

    // cluster metrics
    this.socket.on('metricsReceived', function (data) {
      ClusterStore.metricsReceived(data);
    });

    // cluster logs
    this.socket.on('logsReceived', function (data) {
      ClusterStore.logsReceived(data);
    });

    // cluster state
    this.socket.on('stateReceived', function (data) {
      ClusterStore.stateReceived(data);
    });
  }

  refreshState() {
    if (this.mounted) {
      this.setState( {
        frameworks: ClusterStore.getFrameworks(),
        nodes: ClusterStore.getNodes()
      });
    }
  }

  refreshStats() {
    if (this.mounted) {
      this.setState( { stats: ClusterStore.getStats() });
    }
  }

  refreshLogs() {
    if (this.mounted) {
      this.setState( { logs: ClusterStore.getLogs() });
    }
  }

  handleResize() {
    let widthCurrent = window.matchMedia('(min-width: 1024px)').matches;
    if (this.state.widthMedium !== widthCurrent) {
      this.setState({widthMedium: widthCurrent});
    }
    if (this.state.leftNavExpanded !== widthCurrent) {
      this.setState({leftNavExpanded: widthCurrent});
    }
  }

  handleClick() {
    this.setState({leftNavExpanded: !this.state.leftNavExpanded});
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.handleResize);
    ClusterStore.removeChangeListener(this.refreshStats.bind(this));
    ClusterStore.removeChangeListener(this.refreshLogs.bind(this));
    ClusterStore.removeChangeListener(this.refreshState.bind(this));
    this.mounted = false;
  }

  menuItems() {
    let iconStyle = {
      top: 8,
      marginRight: 10
    };
    let dashboardIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'settings_input_svideo' );
    let nodesIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'dns' );
    let frameworksIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'build' );
    let logsIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'assignment ' );

    let logsText = this.state.leftNavExpanded ? 'Logs' : '';
    let dashboardText = this.state.leftNavExpanded ? 'Dashboard' : '';
    let frameworksText = this.state.leftNavExpanded ? 'Frameworks' : '';
    let nodesText = this.state.leftNavExpanded ? 'Nodes' : '';

    return [
      { route: '/', text: dashboardText, icon: dashboardIcon },
      { route: 'frameworks', text: frameworksText, icon: frameworksIcon },
      { route: 'nodes', text: nodesText, icon: nodesIcon },
      { route: 'logs', text: logsText, icon: logsIcon }
    ];
  }

  getStyle() {
    let burgerColor = this.state.leftNavExpanded ? '#000000' : '#9e9e9e';
    let style = {
      burger: {
        display: 'block',
        padding: '14px 0 14px 24px',
        color: burgerColor,
        background: '#ffffff',
        cursor: 'pointer',
        '@media (min-width: 1024px)': {
          display: 'none'
        }
      },
      'menuDivider': {
        width: '100%',
        borderBottom: '2px solid #9e9e9e',
        '@media (min-width: 1024px)': {
          display: 'none'
        }
      },
      columns: {
        padding: '20px 0 0 10px',
        '@media (min-width: 1024px)': {
          padding: '20px 24px 0'
        }
      },
      logo: {
        padding: '10px 12px'
      }
    };
    return style;
  }

  render() {
    let style = this.getStyle();

    return (
      <div>
        <div className="row">
          
          <Motion style={{
            thisWidth: spring(this.state.leftNavExpanded ? this.props.navMedium : this.props.navSmall, [this.props.motionStiffness, this.props.motionDamping])
          }}>
            {({thisWidth}) =>
            <div style={{
              position: 'fixed',
              height: '100%',
              width: `${thisWidth}px`,
              boxShadow: '2px 0px 3px 0px rgba(0,0,0,0.2)',
              zIndex: 5
            }}>
            <Logo width={50} height={50} />
            <div
              style={style.burger}
              className="material-icons"
              onClick={this.handleClick}>
              menu
            </div>
            <div style={style.menuDivider}></div>
            <Navigation menuItems={this.menuItems()} />
            </div>
            }
          </Motion>

          <Motion style={{
            thisMargin: spring(this.state.widthMedium ? this.props.navMedium: this.props.navSmall, [this.props.motionStiffness, this.props.motionDamping])
          }}>
          {({thisMargin}) =>
            <div style={{marginLeft:`${thisMargin}px`}} className="col-xs-9 col-sm-10">
              <div style={style.columns} className="col-xs-12">
                <RouteHandler
                  {...this.props}
                  nodes={this.state.nodes}
                  frameworks={this.state.frameworks}
                  stats={this.state.stats}
                  logs={this.state.logs}
                />
              </div>
            </div>
          }
          </Motion>

        </div>
      </div>
    );
  }

}

export default App;

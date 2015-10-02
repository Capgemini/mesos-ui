import React from 'react';
import { RouteHandler } from 'react-router';
import withContext from '../../decorators/withContext';
import mui, { FontIcon } from 'material-ui';
import Logo from '../Logo';
import Navigation from '../Navigation';
import Radium from 'radium';

let ThemeManager = new mui.Styles.ThemeManager();

@withContext
@Radium
class App extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  constructor() {
    super();
    this.handleResize = this.handleResize.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  componentWillMount() {
   // ThemeManager.setTheme(ApolloTheme);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    let widthCurrent = window.matchMedia('(minWidth: 1024px)').matches;
    if (this.state.widthMedium !== widthCurrent) {
      this.setState({widthMedium: widthCurrent});
    }
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.handleResize);
  }

  menuItems() {
    let iconStyle = {
      top: 8,
      marginRight: 10
    };
    let dashboardIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'settings_input_svideo' );
    let nodesIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'dns' );
    let frameworksIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'build' );

    let dashboardText = this.state.widthMedium ? 'Dashboard' : '';
    let frameworksText = this.state.widthMedium ? 'Frameworks' : '';
    let nodesText = this.state.widthMedium ? 'Nodes' : '';

    return [
      { route: '/', text: dashboardText, icon: dashboardIcon },
      { route: 'frameworks', text: frameworksText, icon: frameworksIcon },
      { route: 'nodes', text: nodesText, icon: nodesIcon }
    ];
  }

  getStyle() {
    let style = {
      sideBar: {
        transition: 'flex 0.5s ease-out',
        flex: '0 0 66px',
        backgroundColor: '#20272b',
        '@media (minWidth: 1024px)': {
          flex: '0 0 170px'
        }
      },
      columns: {
        padding: '20px 0 0 10px',
        '@media (minWidth: 1024px)': {
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
          <div style={style.sideBar}>
            <div style={style.logo}>
              <Logo width={50} height={50} />
            </div>
            <Navigation menuItems={this.menuItems()} />
          </div>
          <div className="col-xs-9 col-sm-10">
            <div style={style.columns} className="col-xs-12">
              <RouteHandler {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;

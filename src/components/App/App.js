import React from 'react';
import { RouteHandler } from 'react-router';
import withContext from '../../decorators/withContext';
import mui, { FontIcon } from 'material-ui';
import Logo from '../Logo';
import Navigation from '../Navigation';

let ThemeManager = new mui.Styles.ThemeManager();

@withContext
class App extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  componentWillMount() {
    ThemeManager.setTheme(ThemeManager.types.DARK);
  }

  menuItems() {
    let iconStyle = {
      top: 8,
      marginRight: 10
    };
    let dashboardIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'settings_input_svideo' );
    let nodesIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'dns' );
    let frameworksIcon = React.createElement(FontIcon, {style: iconStyle, className: 'material-icons'}, 'build' );
    return [
      { route: '/', text: 'Dashboard', icon: dashboardIcon },
      { route: 'frameworks', text: 'Frameworks', icon: frameworksIcon },
      { route: 'nodes', text: 'Nodes', icon: nodesIcon }
    ];
  }

  getStyle() {
    return {
      padding: '24'
    };
  }

  render() {
    return (
      <div>
        <div className="col-xs-2">
          <Logo width={150} height={100} />
          <Navigation menuItems={this.menuItems()} />
        </div>
        <RouteHandler {...this.props} />
      </div>
    );
  }

}

export default App;

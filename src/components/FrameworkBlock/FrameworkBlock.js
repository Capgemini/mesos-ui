import React, { PropTypes } from 'react';
import { /*Styles, */RaisedButton } from 'material-ui';

class FrameworkBlock extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    logoFile: PropTypes.string,
    version: PropTypes.string,
    tasks: PropTypes.number,
    url: React.PropTypes.string
  };

  static contextTypes = {
    muiTheme: PropTypes.object
  }

  defaultLogo() {
    return 'master/static/assets/icon-framework-' + this.props.name + '.png';
  }

  render() {
    let props = this.props;
    let name = props.name;
    let version = props.version;
    let tasks = props.tasks;
    let webUrl = props.url;
    let logo = props.logoFile || this.defaultLogo();

    let appVersion = '';
    let appTasks = null;
    let appUrl = null;

    if (typeof version !== 'undefined') {
      appVersion = 'v' + version;
    }

    if (typeof tasks !== 'undefined') {
      appTasks = React.createElement('span', {}, '(' + tasks + ' Tasks)');
    }

    if (typeof webUrl !== 'undefined') {
      // Create a button/link element.
      appUrl = React.createElement(RaisedButton, { linkButton: true,
        href: webUrl,
        label: 'Open',
        secondary: true }
      );
    }

    let appLogo = React.createElement('div', { className: 'center-xs logo'},
        React.createElement('img', { width: 70, height: 70, src: logo}));

    return (
      <div>
        {appLogo}
        <div className="center-xs">
          <ul>
            {appTasks}
            <li>{name} {appVersion}</li>
            {appUrl}
          </ul>
        </div>
      </div>
    );
  }

}

export default FrameworkBlock;

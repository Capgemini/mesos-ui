import React, { PropTypes } from 'react';

class ZookeeperRedirect extends React.Component {

  static propTypes = {
    leader: PropTypes.string.isRequired,
    pid: PropTypes.string.isRequired,
    redirectTime: PropTypes.number.isRequired
  };

  componentDidMount() {
    this.redirectToLeader()
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.leader !== this.props.leader;
  }

  componentDidUpdate() {
    this.redirectToLeader()
  }

  redirectToLeader() {
    if (this.props.leader) {
      // Redirect if we aren't the leader.
      if (this.props.leader != this.props.pid) {
        setTimeout(function () {
          window.location = '/master/redirect';
        }, this.props.redirectTime);
      }
    }
  }

  /* @todo - allow overridable styles */
  getStyles() {
    let styles = {
      fontWeight: 500,
      marginBottom: 20
    };
    return styles;
  }

  createAlert() {
    var className = 'hide';
    var alert = null;

    if (this.props.leader) {
      if (this.props.leader != this.props.pid) {
        className = 'show';
        alert = React.createElement('span', null, 'This master is not the leader, redirecting...');
      }
    }
    else {
      className = 'show';
      alert = React.createElement('span', null, 'No master currently leading...');
    }
    return { 'alert': alert, 'className': className }
  }

  render() {

    let style = this.getStyles();
    let alert = this.createAlert().alert;
    let className = this.createAlert().className;
    return (
      <div style={style} className={className} id="zookeeper-leader-alert">
        {alert}
      </div>
    );
  }
}

export default ZookeeperRedirect;

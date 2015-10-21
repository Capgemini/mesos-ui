/*jshint esnext: true */
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

  componentDidUpdate() {
    this.redirectToLeader()
  }

  // method mostly copy from https://github.com/apache/mesos/blob/master/src/webui/master/static/js/controllers.js
  redirectToLeader() {

    var zookeeperRedirect = React.findDOMNode(this);

    if (this.props.leader) {
      // Redirect if we aren't the leader.
      if (this.props.leader != this.props.pid) {

        if (zookeeperRedirect != null) {

          zookeeperRedirect.classList.remove('hide');
          zookeeperRedirect.querySelector('#redirecting-leader-alert').classList.remove('hide');
          zookeeperRedirect.querySelector('#no-leader-alert').setAttribute('class', 'hide');

          var redirectTime = this.props.redirectTime
          var countdown = function() {
            if (redirectTime == 0) {
              window.location = '/master/redirect';
            } else {
              redirectTime = redirectTime - 1000;
              setInterval(function(){
                countdown();
              }, 1000);
            }
          };
          countdown();
        }
      }
    }
    else {
      zookeeperRedirect.classList.remove('hide');
      zookeeperRedirect.querySelector('#no-leader-alert').classList.remove('hide');
    }
  }


  /* @todo - allow overridable styles */
  getStyles() {
    let styles = {
      fontWeight: 100,
      marginBottom: 20
    };
    return styles;
  }

  render() {

    let styles = this.getStyles();
    return (
      <div className="hide" id="zookeeper-leader-alert">
        <div className="hide" id="no-leader-alert" style={styles}>
          <strong><u>No master currently leading...</u></strong>
        </div>
        <div className="hide" id="redirecting-leader-alert">
          <strong>This master is <u>not the leader</u>, redirecting...</strong>
          <a href="/master/redirect">go now</a>
        </div>
      </div>
    );
  }
}

export default ZookeeperRedirect;

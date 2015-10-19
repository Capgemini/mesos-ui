import request from 'superagent';
import ClusterStore from '../../stores/ClusterStore';

var mesosFluxPropagator = {

  propagateMesosData() {
    // Global io object should be available in the browser.
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
};

module.exports = mesosFluxPropagator


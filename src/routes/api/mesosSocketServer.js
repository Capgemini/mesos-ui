/*jshint esnext: true */
import request from 'superagent';
let config = require('../../config/config');

var mesos = require('./mesos')

var mesosFluxPropagator = {


  getSocketMetrics(socket) {
    // Get metrics.
    mesos.getMetrics(function(err, response){
      if (err) {
        console.log(err);
        return;
      }
      socket.emit('metricsReceived', response.body);
    });
  },

  getSocketLogs(socket) {
    // Get metrics.
    mesos.getLogs(function(err, response){
      let size = response.body.offset;
      let offset = parseInt(size-60000)>0 ? parseInt(size-60000) : 0;
      let url = mesos.baseUrl + '/files/read.json?path=/master/log&offset=' + offset + '&length=' + parseInt(offset+100000);
      request
      .get(url)
      .end(function(err, response){
        if (err) {
          console.log(err);
          return;
        }
        socket.emit('logsReceived', response.body);
      });
    });
  },

  getSocketState(socket) {
    // Get state.
    mesos.getState(function(err, response){
      if (err) {
        console.log(err);
        return;
      }
      socket.emit('stateReceived', response.body);
    });
  }


};

module.exports = function(app, io) {

  /**
   * Socket connection for Mesos cluster metrics snapshot
   */
  io.on('connection', function (socket) {
    console.log('connected');

    // Get metrics and state on connect.
    mesosFluxPropagator.getSocketMetrics(socket);
    mesosFluxPropagator.getSocketState(socket);
    mesosFluxPropagator.getSocketLogs(socket);

    // Get metrics and state on interval
    setInterval(function(){
      mesosFluxPropagator.getSocketMetrics(socket);
      mesosFluxPropagator.getSocketState(socket);
      mesosFluxPropagator.getSocketLogs(socket);
    }, config.updateInterval);

    socket.on('disconnect', function() {
      console.log('disconnected');
    });
  });

  /**
    * GET /api/cluster
    * Returns cluster metrics
    */
  app.get('/api/cluster', function(req, res, next) {
    mesos.getMetrics(function(err, response){
      if (err) {
        return next(err);
      }
      res.send(response.body);
    });
  });


  /**
    * GET /api/state
    * Returns cluster state
    */
  app.get('/api/state', function(req, res, next) {
    mesos.getState(function(err, response){
      if (err) {
        return next(err);
      }
      res.send(response.body);
    });
  });


  /**
    * GET /api/slaves
    * Returns the current slaves
    */
  app.get('/api/slaves', function(req, res, next) {
    mesos.getSlaves(function(err, response){
      if (err) {
        return next(err);
      }
      res.send(response.body);
    });
  });
};

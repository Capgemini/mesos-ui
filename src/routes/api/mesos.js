import request from 'superagent';
let config = require('../../config/config');

var mesos = {

  baseUrl: config.mesosEndpoint,

  /**
   * [getMetrics description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getMetrics(callback) {
    let url = this.baseUrl + '/metrics/snapshot';
    request
    .get(url)
    .end(callback);
  },

  /**
   * [getState description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getState(callback) {
    let url = this.baseUrl + '/master/state.json';
    request
    .get(url)
    .end(callback);
  },

  /**
   * [getSlaves description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  getSlaves(callback) {
    let url = this.baseUrl + '/master/slaves';
    request
    .get(url)
    .end(callback);
  },

  getSocketMetrics(socket) {
    // Get metrics.
    this.getMetrics(function(err, response){
      if (err) {
        console.log(err);
        return;
      }
      socket.emit('metricsReceived', response.body);
    });
  },

  getSocketState(socket) {
    // Get state.
    this.getState(function(err, response){
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
    mesos.getSocketMetrics(socket);
    mesos.getSocketState(socket);

    // Get metrics and state on interval
    setInterval(function(){
      mesos.getSocketMetrics(socket);
      mesos.getSocketState(socket);
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

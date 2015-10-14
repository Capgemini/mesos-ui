/*jshint esnext: true */
import request from 'superagent';

let config = require('../../config/config');
let buildType = config.buildType
let buildConfig = config.buildConfig[buildType];

var mesos = {

  baseUrl: buildConfig.mesosEndpoint,

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

  /**
   * [getLogs description]
   * @return {[type]}            [description]
   */
  getLogs(callback) {
    let url = this.baseUrl + '/files/read.json?path=/master/log&offset=-1';
    request
    .get(url)
    .end(callback);
  },

};

module.exports = mesos



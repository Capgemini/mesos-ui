'use strict';
var config = {
  // Interval of API request in ms
  updateInterval: 8000,
  port: 5000,
  // Backend API URLs.
  // Set this to 'http://127.0.0.1:8000' for using the stub server running in DEV mode.
  'mesosEndpoint': typeof(document) !== 'undefined' ? document.location.origin : null
};

module.exports = config;

var config = {
  // Interval of API request in ms
  updateInterval: 2000,
  port: 5000,
  // Backend API URLs.
  // Set this to 'http://127.0.0.1:8000' for using the stub server running in DEV mode.
  'mesosEndpoint': process.env.MESOS_ENDPOINT || (typeof(document) !== 'undefined' ? document.location.origin : null),
  'proxyPath': '/proxy/'
};

if (process.env.MESOS_ENDPOINT) {
  config.mesosEndpoint = config.proxyPath + config.mesosEndpoint
}

module.exports = config;

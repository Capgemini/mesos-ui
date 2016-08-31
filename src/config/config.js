var config = {
  // Interval of API request in ms
  updateInterval: 8000,
  port: 5000,
  // Backend API URLs.
  // Set this to 'http://127.0.0.1:8000' for using the stub server running in DEV mode.
  'mesosEndpoint': (typeof(document) !== 'undefined' ? document.location.origin : null),
  'proxyPath': '/proxy',
  'zookeeperPath': '/mesos'
};

if (process.env.ZOOKEEPER_ADDRESS) {
  config.zookeeperAddress = process.env.ZOOKEEPER_ADDRESS;
  config.mesosEndpoint = config.proxyPath;
} else if (process.env.MESOS_ENDPOINT) {
  config.mesosEndpoint = config.proxyPath;
}

if (process.env.ZOOKEEPER_PATH) {
  config.zookeeperPath = process.env.ZOOKEEPER_PATH;
}

if (process.env.PORT0) {
  config.port = process.env.PORT0;
}
module.exports = config;

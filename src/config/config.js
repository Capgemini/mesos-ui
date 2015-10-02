var config = {
  // Interval of API request in ms
  updateInterval: 5000,
  port: 5000,
  // Backend API URLs. We Default to localhost:8000 which is where the stub
  // server in running in DEV mode.
  mesosEndpoint: process.env.MESOS_ENDPOINT || 'http://localhost:8000'
};

module.exports = config;

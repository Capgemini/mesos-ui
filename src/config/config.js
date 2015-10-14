var config = {
  // Interval of API request in ms
  updateInterval: 5000,
  port: 5000,
  // Backend API URLs. We Default to localhost:8000 which is where the stub
  // server in running in DEV mode.
  // mesos-server or standalone.
  buildType: process.env.MESOS_UI_BUILD_TYPE || 'standalone',

  buildConfig: {
    'standalone': {
      'mesosEndpoint': process.env.MESOS_ENDPOINT || 'http://127.0.0.1:8000',
      'publicFolder': 'public',
      'templateFolder': 'standalone',
      'templateTargetFolder': 'templates',
      'fluxPropagator': 'mesosSocketClient',
      'historyMode': 'HistoryLocation',
      'assetsFolder': ''
    },
    'mesos-server': {
      'mesosEndpoint': typeof(document) !== 'undefined' ? document.location.origin  : null  ,
      'publicFolder': '/master/static',
      'templateFolder': 'mesos-server',
      'templateTargetFolder': '/master/static',
      'fluxPropagator': 'mesosNoSocket',
      'historyMode': 'HashHistory',
      'assetsFolder': '/master/static'
    }
  },
};

module.exports = config;

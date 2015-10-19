/*jshint esnext: true */

import 'babel/polyfill';
import path from 'path';
import express from 'express';
import socketIo from 'socket.io';

let config = require('./config/config');
let buildType = config['buildType']
var buildConfig = config['buildConfig'][buildType]
let app = express();

// Serve static files from /public folder.
app.set('port', config.port);
app.use(express.static(path.join(__dirname, 'public')));

// Initialize socket.io
// Launch the server
// -----------------------------------------------------------------------------
let io = socketIo.listen(app.listen(app.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + app.get('port'));
  }
}));

// // Default routes
require('./routes/default')(app);
// // Mesos API routes
if (buildConfig['fluxPropagator'] === 'mesosSocketClient') {
  require('./routes/api/mesosSocketServer')(app, io);
}

// If we're in development mode spin up a mock server as we may not have a
// running Mesos cluster, so lets just use the stub API in ./stub.json.
if (process.env.NODE_ENV === 'development') {
  let jsonServer = require('json-server');
  let fs = require('fs');

  // Returns an Express server
  let server = jsonServer.create();

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(jsonServer.defaults());

  const stubFile = './src/stub.json';
  let router = jsonServer.router(stubFile);
  server.use(router);

  server.listen(8000);
}

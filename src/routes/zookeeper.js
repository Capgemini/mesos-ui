import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import React from 'react';
import Router from 'react-router';
import routes from './react-routes';
import proxy from 'express-http-proxy';
import express from 'express';

module.exports = function(app) {

  var zookeeper = require('node-zookeeper-client');
  var config = require('../config/config');
  var client = zookeeper.createClient(config.zookeeperAddress);
  var router = express.Router();

  client.once('connected', function () {
    console.log('Connected to the Zookeeper.');

    listChildren(client, config.zookeeperPath).then(function(childrenList) {
      // The smallest one is the leader.
      childrenList.sort();
      return getData(client, config.zookeeperPath + '/' + childrenList[0]);
    }).then(function(jsonData) {
      // The top-level React component + HTML template for it
      let leader = 'http://' + jsonData.address.ip + ':' + jsonData.address.port;
      setRoutes(app, leader);
    });
  });
  client.connect();

  function setRoutes(app, leader) {
    const templateFile = path.join(__dirname, 'master/static/index.html');
    const template = _.template(fs.readFileSync(templateFile, 'utf8'));
    var config = require('../config/config');

    app.get(config.proxyPath + '/*', proxy(leader, {
      forwardPath: function(req, res) {
        // Gets the path after 'proxy/'.
        let path = require('url').parse(req.url).path;
        return path.slice(config.mesosEndpoint.length);
      }
    }));

    app.get('*', function(req, res, next) {
      try {
        let data = { title: '', description: '', css: '', body: '' };
        let css = [];
        Router.run(routes, req.url, function(Handler) {
          let application = (<Handler
            context={{
              onInsertCss: value => css.push(value),
              onSetTitle: value => data.title = value,
              onSetMeta: (key, value) => data[key] = value
            }} />
          );
          data.body = React.renderToString(application);
          data.css = css.join('');
          let html = template(data);
          res.send(html);
        });
      } catch (err) {
        next(err);
      }
    });
  }

  function listChildren(client, path) {
    return new Promise(function(resolve, reject) {
      client.getChildren(
        path,
        function (event) {
          console.log('Got watcher event: %s', event);
          listChildren(client, path).then(function(childrenList) {
            // The smallest one is the leader.
            childrenList.sort();
            return getData(client, path + '/' + childrenList[0]);
          }).then(function(jsonData) {
            var config = require('../config/config');
            // The top-level React component + HTML template for it
            let leader = 'http://' + jsonData.address.ip + ':' + jsonData.address.port;
            // Remove and recreate routes for new leader.
            app._router.stack.pop();
            app._router.stack.pop();
            setRoutes(app, leader);
          });
        },
        function (error, children, stat) {
          if (error) {
            console.log(
              'Failed to list children of %s due to: %s.',
              path,
              error
            );
            reject(Error('It broke'));
          }
          console.log('Children of %s are: %j.', path, children);
          resolve(children);
        }
      );
    });
  }

  function getData(client, path) {
    return new Promise(function(resolve, reject) {
      client.getData(
        path,
        function (event) {
          console.log('Got event: %s.', event);
          getData(client, path);
        },
        function (error, data, stat) {
          if (error) {
            console.log(error.stack);
            reject(Error('It broke'));
            return;
          }
          console.log('Got data: %s', data.toString('utf8'));
          let string = data.toString('utf8');
          let hash = JSON.parse(string);
          resolve(hash);
        }
      );
    });
  }
};

/*jshint esnext: true */

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import React from 'react';
import Router from 'react-router';
import routes from './react-routes';
import proxy from 'express-http-proxy';

module.exports = function(app) {

  // The top-level React component + HTML template for it
  const templateFile = path.join(__dirname, 'master/static/index.html');
  const template = _.template(fs.readFileSync(templateFile, 'utf8'));
  var config = require('../config/config');

  app.get(config.proxyPath + '*', proxy(process.env.MESOS_ENDPOINT, {
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
};

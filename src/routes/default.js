/*jshint esnext: true */

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import React from 'react';
import Router from 'react-router';
import routes from './react-routes';
let config = require('../config/config')
let buildType = config['buildType']
var buildConfig = config['buildConfig'][buildType]

module.exports = function(app) {

  // The top-level React component + HTML template for it
  const templateFile = path.join(__dirname, buildConfig['templateTargetFolder'] + '/index.html');
  const template = _.template(fs.readFileSync(templateFile, 'utf8'));

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

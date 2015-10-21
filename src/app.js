/*jshint esnext: true */

import 'babel/polyfill';
import React from 'react';
import FastClick from 'fastclick';
import Router from 'react-router';
import routes from './routes/react-routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import createHashHistory from 'history/lib/createHashHistory';

let onSetMeta = (name, content) => {
  // Remove and create a new <meta /> tag in order to make it work
  // with bookmarks in Safari
  let elements = document.getElementsByTagName('meta');
  [].slice.call(elements).forEach((element) => {
    if (element.getAttribute('name') === name) {
      element.parentNode.removeChild(element);
    }
  });
  let meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
  document.getElementsByTagName('head')[0].appendChild(meta);
};


function run() {
  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Mesos requests that trigger the Flux worflow passing the data through.
  let fluxPropagator = require('./routes/api/mesosFluxPropagator');
  fluxPropagator.propagateMesosData();

  //Needed for React Developer Tools
  window.React = React;
  Router.run(routes, Router.HashHistory, function(Handler, state) {

    React.render(<Handler
      context={{
        onSetTitle: value => document.title = value,
        onSetMeta
      }}
      {...state} />, document.getElementById('app'));
  });
}

// Run the application when both DOM is ready
// and page content is loaded
Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  }).then(() => FastClick.attach(document.body))
]).then(run);

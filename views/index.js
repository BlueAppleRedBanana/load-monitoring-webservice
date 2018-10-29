"use strict";

var os = require('os');

var process = require('process');

var express = require('express');

var app = express();

var path = require('path');

function loadAvg(loadAvg) {
  return {
    '1m': loadAvg[0],
    '5m': loadAvg[1],
    '15m': loadAvg[2]
  };
}

app.get('/stats', function (req, res) {
  var processInfo = {
    title: process.title,
    pid: process.pid,
    release: process.release,
    versions: process.versions,
    argv: process.argv,
    execArgv: process.execArgv,
    execPath: process.execPath,
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    // mainModule: process.mainModule,
    uptime: process.uptime()
  };
  var cpus = {
    // cpus: os.cpus(),
    uptime: os.uptime(),
    freemem: os.freemem(),
    loadavg: loadAvg(os.loadavg()),
    hostname: os.hostname(),
    platform: process.platform,
    arch: process.arch
  };
  var sample = {
    cpus: cpus,
    processInfo: processInfo
  };
  res.send(sample);
}); // Serving static files

app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media'))); // Starting the server

app.listen(process.env.PORT || 3000, function () {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
}); // our apps data model

var data = require('./assets/data.json');

var initialState = {
  isFetching: false,
  apps: data //SSR function import

};

var ssr = require('./views/server');

var template = require('./views/template'); // server rendered home page


app.get('/', function (req, res) {
  var _ssr = ssr(initialState),
      preloadedState = _ssr.preloadedState,
      content = _ssr.content;

  var response = template("Server Rendered Page", preloadedState, content);
  res.setHeader('Cache-Control', 'assets, max-age=604800');
  res.send(response);
});
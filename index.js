const os = require('os');
const process = require('process');
const express = require('express');
const app = express();
const path = require('path');

function loadAvg (loadAvg) {
  return {
    '1m': loadAvg[0],
    '5m': loadAvg[1],
    '15m': loadAvg[2]
  }
}

app.get('/stats', function (req, res) {
  const processInfo = {
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

  const cpus = {
    // cpus: os.cpus(),
    uptime: os.uptime(),
    freemem: os.freemem(),
    loadavg: loadAvg(os.loadavg()),
    hostname: os.hostname(),
    platform: process.platform,
    arch: process.arch
  };

  const sample = {
    cpus,
    processInfo
  };
  res.send(sample)
});


// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media')));


// Starting the server
app.listen(process.env.PORT || 3000, function () {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!')
});

// our apps data model

let initialState = {
    isFetching: false,
    apps: {},
};

//SSR function import
const ssr = require('./views/server');
const template = require('./views/template');

// server rendered home page
app.get('/', (req, res) => {
    const { preloadedState, content}  = ssr(initialState);
    const response = template("Server Rendered Page", preloadedState, content);
    res.setHeader('Cache-Control', 'assets, max-age=604800');
    res.send(response);
});


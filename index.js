const process = require('process');
const express = require('express');
const app = express();
const path = require('path');
const Monitor = require('./src/service/monitor');

const monitor = new Monitor();
monitor.start();

app.get('/stats', function (req, res) {
  const sample = monitor.getLatestData();
  res.send(sample)
});

app.get('/statsAll', function (req, res) {
  const sample = monitor.getAllData();
  res.send(sample);
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
    const { preloadedState, content }  = ssr(initialState);
    const response = template("Server Rendered Page", preloadedState, content);
    res.setHeader('Cache-Control', 'assets, max-age=604800');
    res.send(response);
});


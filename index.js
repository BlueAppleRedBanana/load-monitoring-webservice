const process = require('process');
const express = require('express');
const app = express();
const path = require('path');
const Monitor = require('./src/service/monitor');

const monitor = new Monitor();
monitor.start();

app.get('/getLatestData', function (req, res) {
    const data = monitor.getLatestData();
    res.send(data);
});

app.get('/getAllData', function (req, res) {
    const data = monitor.getAllData();
    res.send(data);
});

app.get('/getAllAlertHistory', function (req, res) {
    const data = monitor.getAllAlertHistory();
    res.send(data);
});

app.get('/getAlertThreshold', function (req, res) {
    const data = monitor.getAlertThreshold();
    res.send(data);
});

// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

// Starting the server
app.listen(process.env.PORT || 3000, function () {
    // eslint-disable-next-line no-console
    console.log('Example app listening on port 3000!');
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


const os = require('os');
const process = require('process');
const moment = require('moment');

module.exports = function Monitor(interval = 1000, window = 60, alertThreshold = 1) {
    var data = [];
    var intervalRunner;
    Monitor.prototype.start = function() {
        intervalRunner = setInterval(runner, 1000);
    };

    Monitor.prototype.stop = function() {
        clearInterval(intervalRunner);
    };

    Monitor.prototype.getAllData = function() {
        return data;
    };

    Monitor.prototype.getLatestData = function() {
        return data[data.length-1];
    };

    var runner = function() {
        if (data.length > 600) {
            data.shift();
        }
        data.push(getStats());
    };

    var getLoad = function() {
        return os.loadavg()[0] / os.cpus().length
    };

    var getStats = function() {
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

        const cpuStat = {
            cpus: os.cpus(),
            uptime: os.uptime(),
            freemem: os.freemem(),
            loadavg: loadAvg(os.loadavg()),
            hostname: os.hostname(),
            platform: process.platform,
            arch: process.arch
        };

        const timestamp = moment().format();

        const sample = {
            cpuStat,
            processInfo,
            timestamp,
        };
        return sample;
    }

    var loadAvg = function(loadAvg) {
        return {
            '1m': loadAvg[0],
            '5m': loadAvg[1],
            '15m': loadAvg[2]
        }
    }

};



const os = require('os');
const process = require('process');
const moment = require('moment');
const util = require('../utils/statHelper.js');

/**
 * Monitor
 * 'start()' will run monitoring process
 *
 * @param interval frequency of monitor in millisecond
 * @param window how long monitor should keep the history, number of ticks
 * @param alertThreshold cpu load threshold to alert
 */
module.exports = function Monitor(interval = 1000, window = 60, alertThreshold = 1) {
    var data = [];
    var alertHistory = [];
    var alert = false;
    var intervalId;

    /**
     * start monitor process
     */
    Monitor.prototype.start = function() {
        intervalId = setInterval(runner, 1000);
    };

    /**
     * stop the monitor process
     */
    Monitor.prototype.stop = function() {
        clearInterval(intervalId);
    };

    /**
     * get all the stat history within the window
     * @returns {Array}
     */
    Monitor.prototype.getAllData = function() {
        return data;
    };


    Monitor.prototype.getAllAlertHistory = function() {
        return alertHistory;
    };

    /**
     * get latest tick data
     * @returns {*}
     */
    Monitor.prototype.getLatestData = function() {
        return data[data.length-1];
    };

    var runner = function() {
        if (data.length > 600) {
            data.shift();
        }
        let stats = getStats();
        data.push(stats);
        recordAlert(stats);

    };

    var recordAlert = function(stats) {
        if (alert && (util.parseTickCpuLoad(stats.cpuStat) < alertThreshold)) {
            alert = false;
            alertHistory.push(stats);
        } else if (util.parseTickCpuLoad(stats.cpuStat) > alertThreshold) {
            alert = true;
            alertHistory.push(stats);
        }
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
            loadavg: loadavg(os.loadavg()),
            hostname: os.hostname(),
            platform: process.platform,
            arch: process.arch
        };

        const timestamp = moment().format();
        let isAlertTriggered = false;

        if (alert && (util.parseTickCpuLoad(cpuStat) < alertThreshold)) {
            alert = false;
            isAlertTriggered = true;
        } else if (util.parseTickCpuLoad(cpuStat) > alertThreshold) {
            alert = true;
            isAlertTriggered = true;
        }

        /**
         * alert current alert status
         * isAlertTriggered if alert status has changed
         * @type {{cpuStat: {cpus: *, uptime: *, freemem: *, loadavg: {"1m", "5m", "15m"}, hostname: *, platform: *, arch: *}, processInfo: {title: *, pid: *, release: *, versions: *, argv: *, execArgv: *, execPath: *, cpuUsage: *, memoryUsage: *, uptime: *}, timestamp: string, alert: boolean, isAlertTriggered: boolean}}
         */
        const sample = {
            cpuStat,
            processInfo,
            timestamp,
            alert,
            isAlertTriggered,
        };
        return sample;
    };

    var loadavg = function(loadavg) {
        return {
            '1m': loadavg[0],
            '5m': loadavg[1],
            '15m': loadavg[2]
        }
    };
};



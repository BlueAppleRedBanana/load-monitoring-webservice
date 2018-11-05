const moment = require('moment');
const { getProcessInfo, getCpuStat, getAlertStatus } = require('./statCore');

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
    var currentAlert = false;
    var intervalId;

    /**
     * start monitor process
     */
    Monitor.prototype.start = function() {
        intervalId = setInterval(runner, interval);
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
        let stats = getTickData();
        data.push(stats);
    };

    var getTickData = function() {
        const timestamp = moment().format();
        const processInfo = getProcessInfo();
        const cpuStat = getCpuStat();

        const { alert, isAlertUpdated } = getAlertStatus(cpuStat, currentAlert, alertThreshold);

        /**
         * alert current alert status
         * isAlertUpdated if alert status has changed
         * @type {{cpuStat: {cpus: *, uptime: *, freemem: *, loadavg: {"1m", "5m", "15m"}, hostname: *, platform: *, arch: *}, processInfo: {title: *, pid: *, release: *, versions: *, argv: *, execArgv: *, execPath: *, cpuUsage: *, memoryUsage: *, uptime: *}, timestamp: string, alert: boolean, isAlertUpdated: boolean}}
         */
        const sample = {
            cpuStat,
            processInfo,
            timestamp,
            alert,
            isAlertTriggered: isAlertUpdated,
        };
        return sample;
    };
};



const moment = require('moment');
const { getProcessInfo, getCpuStat } = require('./stat');

const AlertManager = require('./alertManager');

/**
 * Monitor
 * 'start()' will run monitoring process
 *
 * @param interval frequency of monitor in millisecond
 * @param window how long monitor should keep the history, number of ticks
 * @param alertThreshold cpu load threshold to alert
 */
module.exports = function Monitor(interval = 10000, window = 60, alertThreshold = 1) {
    let intervalId;
    const data = []

    let tickIndex = 0;

    const alertManager = new AlertManager({ alertThreshold });

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
     * get current alert threshold
     */
    Monitor.prototype.getAlertThreshold = function() {
        return alertThreshold;
    };

    /**
     * get all the stat history within the window
     * @returns {Array}
     */
    Monitor.prototype.getAllData = function() {
        return data;
    };

    /**
     * get latest tick data
     * @returns {*}
     */
    Monitor.prototype.getLatestData = function() {
        return data[data.length-1];
    };

    let runner = function() {
        if (data.length > 600) {
            data.shift();
        }
        let stats = getTickData();
        data.push(stats);
    };

    Monitor.prototype.getAllAlertHistory = function() {
        return alertManager.getAllAlertHistory();
    };

    let getTickData = function() {
        const timestamp = moment().format();
        tickIndex++;

        const processInfo = getProcessInfo();
        const cpuStat = getCpuStat();

        const alert = alertManager.getAlert({ cpuStat, timestamp, tickIndex });

        const sample = {
            cpuStat,
            processInfo,
            timestamp,
            alert,
        };
        return sample;
    };
};



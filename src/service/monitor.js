const moment = require('moment');
const { getProcessInfo, getCpuStat, getAlertStatus } = require('./statCore');
const { parseTickCpuLoad } = require('../utils/statHelper');

/**
 * Monitor
 * 'start()' will run monitoring process
 *
 * @param interval frequency of monitor in millisecond
 * @param window how long monitor should keep the history, number of ticks
 * @param alertThreshold cpu load threshold to alert
 */
module.exports = function Monitor(interval = 1000, window = 60, alertThreshold = 1) {
    let intervalId;

    const data = []
    const alertHistory = [];

    let currentAlert = false;

    // the number of records to check alert
    const WINDOW_SIZE_FOR_ALERT = 3;

    // keep recent WINDOW_SIZE_FOR_ALERT records of delta values against to alertThreshold
    // so that we can check if avg load for recent 12 records are over or under
    // the threshold
    const deltasToAlertThreshold = [];

    let tickIndex = 0;

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
        return alertHistory;
    };

    let getTickData = function() {
        const timestamp = moment().format();
        const processInfo = getProcessInfo();
        const cpuStat = getCpuStat();

        // manage delta
        if (deltasToAlertThreshold.length >= WINDOW_SIZE_FOR_ALERT) {
            deltasToAlertThreshold.shift();
        }
        const cpuLoad = parseTickCpuLoad(cpuStat);
        const delta = cpuLoad - alertThreshold;
        deltasToAlertThreshold.push(delta);
        console.log(cpuLoad);

        const { alert, isAlertUpdated, sumOfDeltas } = getAlertStatus(deltasToAlertThreshold, currentAlert);
        currentAlert = alert;


        let alertData = null;

        let alertLoad = ( sumOfDeltas / WINDOW_SIZE_FOR_ALERT) + alertThreshold;
        if (isAlertUpdated) {
            alertData = {
                timestamp,
                message: alert
                    ? 'High load generated an alert - load = ' + alertLoad + ', triggered at ' + timestamp
                    : 'Alert is recovered - load = ' + alertLoad + ', at ' + timestamp
                ,
                load: alertLoad,
                tickIndex: tickIndex++,
            };
            alertHistory.push(alertData);
        }

        /**
         * alert current alert status
         * isAlertUpdated if alert status has changed
         * @type {{cpuStat: {cpus: *, uptime: *, freemem: *, loadavg: {"1m", "5m", "15m"}, hostname: *, platform: *, arch: *}, processInfo: {title: *, pid: *, release: *, versions: *, argv: *, execArgv: *, execPath: *, cpuUsage: *, memoryUsage: *, uptime: *}, timestamp: string, alert: boolean, isAlertUpdated: boolean}}
         */
        const sample = {
            cpuStat,
            processInfo,
            timestamp,
            alert: alertData,
        };
        return sample;
    };
};



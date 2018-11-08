const os = require('os');
const process = require('process');
const util = require('../utils/statHelper.js');

exports.getProcessInfo = function() {
    return {
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
};

exports.getCpuStat = function() {
    return {
        cpus: os.cpus(),
        uptime: os.uptime(),
        freemem: os.freemem(),
        loadavg: loadavg(os.loadavg()),
        hostname: os.hostname(),
        platform: process.platform,
        arch: process.arch
    };
};

/**
 *
 * @param deltasToAlertThreshold
 * @param currentAlert
 * @returns {{alert: boolean, isAlertUpdated: boolean, sumOfDeltas: *}}
 */
exports.getAlertStatus = function(deltasToAlertThreshold, currentAlert) {
    const sumOfDeltas = deltasToAlertThreshold.reduce((a, b) => a + b, 0);
    console.log(deltasToAlertThreshold, sumOfDeltas);

    // if the sum of recent delta is over than zero
    // then avg load for recent records is over than threshold
    const alert = sumOfDeltas >= 0;
    const isAlertUpdated = currentAlert !== alert;

    return {
        alert,
        isAlertUpdated,
        sumOfDeltas,
    };
};

function loadavg(loadavg) {
    return {
        '1m': loadavg[0],
        '5m': loadavg[1],
        '15m': loadavg[2]
    }
}
const os = require('os');
const process = require('process');

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



function loadavg(loadavg) {
    return {
        '1m': loadavg[0],
        '5m': loadavg[1],
        '15m': loadavg[2]
    }
}
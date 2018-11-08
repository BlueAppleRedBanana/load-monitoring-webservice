/**
 * returns 1min cpu avg load / number of cpus
 * @param cpuStat
 * @returns {number}
 */
exports.parseTickCpuLoad = function (cpuStat) {
    return (cpuStat.loadavg['1m'] / cpuStat.cpus.length) * Math.random() + 0.7;
};
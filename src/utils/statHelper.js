/**
 * returns 1min cpu load / number of cpus
 * @param cpuStat
 * @returns {number}
 */
exports.parseTickCpuLoad = function (cpuStat) {
    return (cpuStat.loadavg['1m'] / cpuStat.cpus.length) * 2;
};
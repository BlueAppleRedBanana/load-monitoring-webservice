const { parseTickCpuLoad } = require('../utils/statHelper');

module.exports = function AlertManager({ alertThreshold }) {
    const alertHistory = [];

    let currentAlert = false;

    // the number of past records that alert rule is interested
    const WINDOW_SIZE_FOR_ALERT = 12;

    // keep recent WINDOW_SIZE_FOR_ALERT records of delta values against to alertThreshold
    // so that we can check if avg load for recent 12 records are over or under
    // the threshold
    const deltasToAlertThreshold = [];

    AlertManager.prototype.getDeltas = function() {
        return deltasToAlertThreshold;
    };

    /**
     * keep tracking recent load history
     * if alert happens return alert data
     * else return null
     * @param cpuStat
     * @param timestamp
     * @param tickIndex
     * @returns { timestamp, message, load, tickIndex }
     */
    AlertManager.prototype.getAlert = function({ cpuStat, timestamp, tickIndex }) {
        this.updateDeltas(cpuStat);
        const {
            alert,
            isAlertUpdated,
            sumOfDeltas
        } = this.getAlertStatus(deltasToAlertThreshold, currentAlert);

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
                tickIndex,
            };
            alertHistory.push(alertData);
        }

        return alertData;
    };

    /**
     * check if alert status needs to be toggled
     * this is more likely private method - made it public for testing purpose
     * @returns {{alert: boolean, isAlertUpdated: boolean, sumOfDeltas: (*|number)}}
     */
    AlertManager.prototype.getAlertStatus = function(deltas, currentAlert) {
        const sumOfDeltas = deltas.reduce((a, b) => a + b, 0);

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

    AlertManager.prototype.updateDeltas = function(cpuStat) {
        // manage delta
        if (deltasToAlertThreshold.length >= WINDOW_SIZE_FOR_ALERT) {
            deltasToAlertThreshold.shift();
        }
        const cpuLoad = parseTickCpuLoad(cpuStat);
        const delta = cpuLoad - alertThreshold;
        deltasToAlertThreshold.push(delta);
    };

    AlertManager.prototype.getAllAlertHistory = function() {
        return alertHistory;
    };
};
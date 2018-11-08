const AlertManager = require('../alertManager');
jest.mock('../../utils/statHelper', () => ({
    parseTickCpuLoad: jest.fn(),
}));
const { parseTickCpuLoad } = require('../../utils/statHelper');

describe('AlertManager', () => {
    const AlertThresholdAsOne = 1;
    let alertManager = null;

    beforeEach(() => {
        alertManager = new AlertManager({ alertThreshold: AlertThresholdAsOne });
    });

    describe('getAlert', () => {
        const cpuStat = {};
        const timestamp = 'timestamp';
        const tickIndex = 1;
        describe('if alert status needs to be toggled', () => {
            it('alert is true, returns alert data with message', () => {
                // mocking getAlertStatus
                AlertManager.prototype.getAlertStatus = function() {
                    return {
                        alert: true,
                        isAlertUpdated: true,
                        sumOfDeltas: 0,
                    };
                };

                const alert = alertManager.getAlert({ cpuStat, timestamp, tickIndex });

                expect(alert).toEqual({
                    timestamp,
                    message: 'High load generated an alert - load = 1, triggered at timestamp',
                    load: 1,
                    tickIndex: 1 });
            });
            it('alert is false, returns alert data with message', () => {
                // mocking getAlertStatus
                AlertManager.prototype.getAlertStatus = function() {
                    return {
                        alert: false,
                        isAlertUpdated: true,
                        sumOfDeltas: 0,
                    };
                };

                const alert = alertManager.getAlert({ cpuStat, timestamp, tickIndex });

                expect(alert).toEqual({
                    timestamp,
                    message: 'Alert is recovered - load = 1, at timestamp',
                    load: 1,
                    tickIndex: 1 });
            });
        });

        it('if alert status does not need to be toggled, returns null',() => {
            // mocking getAlertStatus
            AlertManager.prototype.getAlertStatus = function() {
                return {
                    alert: true,
                    isAlertUpdated: false,
                    sumOfDeltas: 0,
                };
            };

            const alert = alertManager.getAlert({ cpuStat, timestamp, tickIndex });

            expect(alert).toEqual(null);
        });
    });


    describe('updateDeltas', () => {
        let alertManager = null;
        beforeEach(() => {
            alertManager = new AlertManager({ alertThreshold: AlertThresholdAsOne });
        });

        it('given cpuStat, add new delta against to threshold', () => {
            parseTickCpuLoad.mockImplementation(() => 1.1);
            const fakeStat = {};
            alertManager.updateDeltas(fakeStat);
            const deltas = alertManager.getDeltas();
            expect(deltas.length).toEqual(1);
        });

        it('maintain the length of deltas in window size, removing the oldest delta, while adding new delta', () => {
            parseTickCpuLoad.mockImplementation(() => 0);
            const fakeStat = {};

            alertManager.updateDeltas(fakeStat);
            parseTickCpuLoad.mockImplementation(() => 1);
            for(let i = 0; i < 12; i++) {
                alertManager.updateDeltas(fakeStat);
            }

            const deltas = alertManager.getDeltas();
            expect(deltas.length).toEqual(12);
            expect(deltas[0]).toEqual(0);
        });
    });

    describe('getAlertStatus', () => {
        let alertManager = null;

        const sumOfDeltasOverThanZero = [-0.1, 0.1, 0.1];
        const sumOfDeltasLessThanZero = [-0.1, 0.1, -0.1];

        beforeEach(() => {
            alertManager = new AlertManager(AlertThresholdAsOne);
        });

        it('returns alert true if deltas sum is greater than zero', () => {
            const { alert } = alertManager.getAlertStatus(sumOfDeltasOverThanZero, true);
            expect(alert).toEqual(true);
        });

        it('returns alert false if deltas sum is less than zero', () => {
            const { alert } = alertManager.getAlertStatus(sumOfDeltasLessThanZero, true);
            expect(alert).toEqual(false);
        });

        it('returns isAlertUpdated true if currentAlert is different to new alert', () => {
            let result = alertManager.getAlertStatus(sumOfDeltasOverThanZero, false);
            expect(result.isAlertUpdated).toEqual(true);

            result = alertManager.getAlertStatus(sumOfDeltasLessThanZero, true);
            expect(result.isAlertUpdated).toEqual(true);
        });

        it('returns isAlertUpdated false if currentAlert is same to new alert', () => {
            let result = alertManager.getAlertStatus(sumOfDeltasOverThanZero, true);
            expect(result.isAlertUpdated).toEqual(false);

            result = alertManager.getAlertStatus(sumOfDeltasLessThanZero, false);
            expect(result.isAlertUpdated).toEqual(false);
        });
    });
});
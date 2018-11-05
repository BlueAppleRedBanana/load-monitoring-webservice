import { getAlertStatus } from '../statCore';

describe('getAlertStatus', () => {
    jest.mock('../../utils/statHelper', () => ({
        parseTickCpuLoad: () => 1.1
    }));

    const cpuStatLoadIsGreaterThanOne = {
        loadavg: { '1m': 1.1 },
        cpus: [1],
    };

    const cpuStatLoadIsLessThanOne = {
        loadavg: { '1m': 0.9 },
        cpus: [1],
    };

    const thresholdAsOne = 1;

    it('returns alert true if cpuLoad is greater than threshold', () => {
        const { alert } = getAlertStatus(cpuStatLoadIsGreaterThanOne, true, thresholdAsOne);
        expect(alert).toEqual(true);
    });

    it('returns alert false if cpuLoad is less than threshold', () => {
        const { alert } = getAlertStatus(cpuStatLoadIsLessThanOne, true, thresholdAsOne);
        expect(alert).toEqual(false);
    });

    it('returns isAlertUpdated true if currentAlert is different to new alert', () => {
        let result = getAlertStatus(cpuStatLoadIsGreaterThanOne, false, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(true);

        result = getAlertStatus(cpuStatLoadIsLessThanOne, true, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(true);
    });

    it('returns isAlertUpdated false if currentAlert is same to new alert', () => {
        let result = getAlertStatus(cpuStatLoadIsGreaterThanOne, true, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(false);

        result = getAlertStatus(cpuStatLoadIsLessThanOne, false, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(false);
    });
});
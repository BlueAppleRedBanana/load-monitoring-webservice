import { getAlertStatus } from '../statCore';

describe('getAlertStatus', () => {
    jest.mock('../../utils/statHelper', () => ({
        parseTickCpuLoad: () => 1.1
    }));

    const sumOfDeltasOverThanZero = [-0.1, 0.1, 0.1];

    const sumOfDeltasLessThanZero = [-0.1, 0.1, -0.1];

    const thresholdAsOne = 1;

    it('do not trigger alert if recent record is less than 12', () => {

    });

    it('returns alert true if deltas sum is greater than zero', () => {
        const { alert } = getAlertStatus(sumOfDeltasOverThanZero, true);
        expect(alert).toEqual(true);
    });

    it('returns alert false if deltas sum is less than zero', () => {
        const { alert } = getAlertStatus(sumOfDeltasLessThanZero, true);
        expect(alert).toEqual(false);
    });

    it('returns isAlertUpdated true if currentAlert is different to new alert', () => {
        let result = getAlertStatus(sumOfDeltasOverThanZero, false, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(true);

        result = getAlertStatus(sumOfDeltasLessThanZero, true, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(true);
    });

    it('returns isAlertUpdated false if currentAlert is same to new alert', () => {
        let result = getAlertStatus(sumOfDeltasOverThanZero, true, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(false);

        result = getAlertStatus(sumOfDeltasLessThanZero, false, thresholdAsOne);
        expect(result.isAlertUpdated).toEqual(false);
    });
});
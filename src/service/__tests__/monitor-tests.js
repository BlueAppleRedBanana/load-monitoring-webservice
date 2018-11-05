import Monitor from '../monitor';

describe('monitor', () => {
    describe('alert', () => {
        jest.mock('../../utils/statHelper', () => ({
            parseTickCpuLoad: () => 1.1
        }));

        it('test', () => {
            expect(true).toBe(true);
            let monitor = new Monitor();
            monitor.start();

        })
    });
});
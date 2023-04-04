import { describe, expect, it } from 'vitest';
import range from './range';
describe.concurrent('Helpers / Range (list every integer in range of two)', () => {
    describe.concurrent('given start >= end', () => {
        it('should return the empty list', () => {
            expect(range(20, 10)).toEqual([]);
            expect(range(10, 10)).toEqual([]);
        });
    });
    describe.concurrent('given start < end', () => {
        it('should return every number between them, inclusive', () => {
            expect(range(10, 20)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        });
    });
});

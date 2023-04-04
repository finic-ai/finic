import { describe, expect, it } from 'vitest';
import { mergeDeep } from './mergeDeep';
describe.concurrent('Helper / mergeDeep (Deeply merge two objects)', () => {
    it('should use the overriding value given an identical key in both inputs', () => {
        const defaultTheme = {
            base: 'base',
            content: {
                base: 'content',
            },
            flush: {
                off: 'no-flush',
                on: 'flush',
            },
        };
        const overrides = {
            content: {
                base: 'new-content',
            },
            flush: {
                off: 'new-no-flush',
                on: 'new-flush',
            },
        };
        expect(mergeDeep(defaultTheme, overrides)).toEqual({
            base: 'base',
            content: {
                base: 'new-content',
            },
            flush: {
                off: 'new-no-flush',
                on: 'new-flush',
            },
        });
    });
});

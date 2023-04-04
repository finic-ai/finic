"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const mergeDeep_1 = require("./mergeDeep");
vitest_1.describe.concurrent('Helper / mergeDeep (Deeply merge two objects)', () => {
    (0, vitest_1.it)('should use the overriding value given an identical key in both inputs', () => {
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
        (0, vitest_1.expect)((0, mergeDeep_1.mergeDeep)(defaultTheme, overrides)).toEqual({
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

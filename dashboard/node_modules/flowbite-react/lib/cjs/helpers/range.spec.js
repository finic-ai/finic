"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const range_1 = __importDefault(require("./range"));
vitest_1.describe.concurrent('Helpers / Range (list every integer in range of two)', () => {
    vitest_1.describe.concurrent('given start >= end', () => {
        (0, vitest_1.it)('should return the empty list', () => {
            (0, vitest_1.expect)((0, range_1.default)(20, 10)).toEqual([]);
            (0, vitest_1.expect)((0, range_1.default)(10, 10)).toEqual([]);
        });
    });
    vitest_1.describe.concurrent('given start < end', () => {
        (0, vitest_1.it)('should return every number between them, inclusive', () => {
            (0, vitest_1.expect)((0, range_1.default)(10, 20)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        });
    });
});

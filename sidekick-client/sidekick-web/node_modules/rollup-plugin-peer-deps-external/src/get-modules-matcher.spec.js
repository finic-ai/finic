import getModulesMatcher from './get-modules-matcher';

describe('#getModulesMatcher', () => {
  describe('when passed an empty array', () => {
    it('returns a predicate that always returns false', () => {
      const fn = getModulesMatcher([]);

      expect(fn('lodash')).toBe(false);
      expect(fn('lodash/map')).toBe(false);
    });
  });

  describe('when passed an array of module names', () => {
    it('returns a predicate that returns true for matching modules', () => {
      const fn = getModulesMatcher(['lodash', 'ramda', 'antd']);

      expect(fn('lodash')).toBe(true);
      expect(fn('lodash/map')).toBe(true);
      expect(fn('lodash/object/pick')).toBe(true);
      expect(fn('ramda')).toBe(true);
      expect(fn('antd/lib/date-picker')).toBe(true);
      expect(fn('babel-plugin-lodash')).toBe(false);
      expect(fn('lodash-es')).toBe(false);
    });
  });

  describe('when passed anything but an array', () => {
    it('throws an error', () => {
      expect(() => getModulesMatcher()).toThrow();
      expect(() => getModulesMatcher(null)).toThrow();
      expect(() => getModulesMatcher('string')).toThrow();
    });
  });
});

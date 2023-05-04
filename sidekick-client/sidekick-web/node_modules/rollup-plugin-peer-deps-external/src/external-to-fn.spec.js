import externalToFn from './external-to-fn';

describe('#externalToFn', () => {
  describe('when passed a function', () => {
    it('returns the same function', () => {
      const fn = () => true;
      expect(externalToFn(fn)).toBe(fn);
    });
  });

  describe('when passed an a module name', () => {
    it('returns a predicate returning true if passed the module name', () => {
      const fn = externalToFn('lodash');

      expect(fn('lodash')).toBe(true);
      expect(fn('lodash-')).toBe(false);
      expect(fn('lodash-es')).toBe(false);
      expect(fn('lodash/map')).toBe(false);
    });
  });

  describe('when passed a regex name', () => {
    it('returns a predicate returning true if passed a module name matching the regex', () => {
      const fn = externalToFn(/-/);

      expect(fn('lodash')).toBe(false);
      expect(fn('lodash-')).toBe(true);
      expect(fn('lodash-es')).toBe(true);
      expect(fn('lodash/map')).toBe(false);
    });
  });

  describe('when passed an array of module names', () => {
    it('returns a predicate returning true if passed one of the module names', () => {
      const modules = ['lodash', 'lodash-es'];
      const fn = externalToFn(modules);

      expect(fn('lodash')).toBe(true);
      expect(fn('lodash-')).toBe(false);
      expect(fn('lodash-es')).toBe(true);
      expect(fn('lodash/map')).toBe(false);
    });
  });

  describe('when passed an array of regexes', () => {
    it('returns a predicate returning true if passed a module name matching one of the regexes', () => {
      const regexes = [/es/, /\//];
      const fn = externalToFn(regexes);

      expect(fn('lodash')).toBe(false);
      expect(fn('lodash-')).toBe(false);
      expect(fn('lodash-es')).toBe(true);
      expect(fn('lodash/map')).toBe(true);
    });
  });

  describe('when passed undefined', () => {
    it('returns false', () => {
      const fn = externalToFn(undefined);

      expect(fn('lodash')).toBe(false);
      expect(fn('lodash-')).toBe(false);
      expect(fn('lodash-es')).toBe(false);
      expect(fn('lodash/map')).toBe(false);
    });
  });

  describe('when passed anything else', () => {
    it('throws an error', () => {
      expect(() => externalToFn(null)).toThrow();
    });
  });
});

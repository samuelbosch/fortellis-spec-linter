const {
  isPathParam,
  fortellisPathCasing
} = require('../../src/functions/oas2-fortellis');

describe('isPathParam()', function() {
  it('should detectd path parameter segments', async function() {
    const tests = [
      {
        segment: '{foo}',
        expected: true
      },
      {
        path: 'foo',
        expected: false
      }
    ];

    for (const t of tests) {
      const result = isPathParam(t.segment);
      expect(result).toBe(t.expected);
    }
  });
});

describe('function fortellisPathCasing', function() {
  it('should pass kebab-case path segments', async function() {
    const tests = [
      {
        path: '/',
        expected: []
      },
      {
        path: '/foo',
        expected: []
      },
      {
        path: '/foo-bar',
        expected: []
      },
      {
        path: '/foo-bar/baz',
        expected: []
      },
      {
        path: '/{foo}',
        expected: []
      },
      {
        path: '/foo/{bar}',
        expected: []
      },
      {
        path: '/foo/{bar}/baz',
        expected: []
      }
    ];

    for (const t of tests) {
      const results = fortellisPathCasing(t.path);
      expect(results).toEqual(t.expected);
    }
  });

  it('should fail non-kebab-case path segments', async function() {
    const tests = [
      {
        path: '/FooBar',
        expected: { message: 'path segment `FooBar` should be `kebab-case`' }
      },
      {
        path: '/FooBar/{bazId}',
        expected: { message: 'path segment `FooBar` should be `kebab-case`' }
      },
      {
        path: '/{fooId}/Baz-Bam',
        expected: { message: 'path segment `Baz-Bam` should be `kebab-case`' }
      }
    ];

    for (const t of tests) {
      const results = fortellisPathCasing(t.path);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(t.expected);
    }
  });
});

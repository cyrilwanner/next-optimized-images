const withOptimizedImages = require('../lib');

describe('next-optimized-images', () => {
  it('returns a next.js config object', () => {
    const config = withOptimizedImages();

    expect(typeof config.webpack).toBe('function');
  });
});

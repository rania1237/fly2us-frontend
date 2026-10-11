import { describe, it, expect } from 'vitest';

describe('FLY2US Frontend', () => {
  it('placeholder test that always passes', () => {
    expect(1 + 1).toBe(2);
  });

  it('environment sanity check', () => {
    expect(typeof window).toBe('object');
  });
});
import { describe, it, expect } from 'vitest';
import { extractErrorMessages } from './error-message';

describe('extractErrorMessages', () => {
  it('returns a single message wrapped in an array', () => {
    expect(extractErrorMessages({ message: 'Invalid credentials' })).toEqual([
      'Invalid credentials',
    ]);
  });

  it('returns an array of messages as-is', () => {
    const body = { message: ['Username taken', 'Password too short'] };
    expect(extractErrorMessages(body)).toEqual([
      'Username taken',
      'Password too short',
    ]);
  });

  it('falls back to a generic message for unexpected shapes', () => {
    expect(extractErrorMessages(null)).toEqual(['Something went wrong']);
    expect(extractErrorMessages({})).toEqual(['Something went wrong']);
    expect(extractErrorMessages('a plain string')).toEqual([
      'Something went wrong',
    ]);
  });
});
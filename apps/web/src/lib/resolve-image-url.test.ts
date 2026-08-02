import { describe, it, expect } from 'vitest';
import { resolveImageUrl } from './resolve-image-url';

describe('resolveImageUrl', () => {
  it('returns null when given null', () => {
    expect(resolveImageUrl(null)).toBeNull();
  });

  it('passes through an absolute https URL unchanged', () => {
    const url = 'https://s3.us-west-004.backblazeb2.com/bucket/key?sig=abc';
    expect(resolveImageUrl(url)).toBe(url);
  });

  it('passes through an absolute http URL unchanged', () => {
    const url = 'http://localhost:9000/bucket/key';
    expect(resolveImageUrl(url)).toBe(url);
  });

  it('prefixes a relative path with the API base URL', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    expect(resolveImageUrl('/local-storage/users/1/file.jpg')).toBe(
      'http://localhost:3000/local-storage/users/1/file.jpg',
    );
  });
});
import { extractTokenFromHeader, generateToken, verifyToken } from './jwt.utils';

describe('jwt utils', () => {
  it('generates and verifies token', () => {
    const token = generateToken({ userId: 10, email: 'u@test.dev', nickname: 'user' });
    const payload = verifyToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(10);
    expect(payload?.email).toBe('u@test.dev');
  });

  it('returns null for invalid token', () => {
    const payload = verifyToken('invalid-token');
    expect(payload).toBeNull();
  });

  it('extracts bearer token', () => {
    expect(extractTokenFromHeader('Bearer abc123')).toBe('abc123');
    expect(extractTokenFromHeader('Token abc')).toBeNull();
    expect(extractTokenFromHeader(undefined)).toBeNull();
  });
});

import { validateEmail, validateNickname } from './validation.utils';

describe('validation utils', () => {
  it('validates emails', () => {
    expect(validateEmail('mail@test.dev')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
  });

  it('validates nickname constraints', () => {
    expect(validateNickname('ab').valid).toBe(false);
    expect(validateNickname('a'.repeat(51)).valid).toBe(false);
    expect(validateNickname('bad name').valid).toBe(false);
    expect(validateNickname('good_name-1').valid).toBe(true);
  });
});

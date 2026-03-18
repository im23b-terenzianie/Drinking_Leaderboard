import { comparePassword, hashPassword, validatePasswordStrength } from './password.utils';

describe('password utils', () => {
  it('hashes and compares password', async () => {
    const hash = await hashPassword('secret123');
    await expect(comparePassword('secret123', hash)).resolves.toBe(true);
    await expect(comparePassword('wrong123', hash)).resolves.toBe(false);
  });

  it('validates password strength', () => {
    expect(validatePasswordStrength('short').valid).toBe(false);
    expect(validatePasswordStrength('onlyletters').valid).toBe(false);
    expect(validatePasswordStrength('12345678').valid).toBe(false);
    expect(validatePasswordStrength('goodpass1').valid).toBe(true);
  });
});

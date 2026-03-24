/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate nickname format
 * - 3-50 characters
 * - Alphanumeric, underscores, and hyphens only
 */
export function validateNickname(nickname: string): {
  valid: boolean;
  message?: string;
} {
  if (nickname.length < 3) {
    return {
      valid: false,
      message: 'Nickname must be at least 3 characters long',
    };
  }

  if (nickname.length > 50) {
    return {
      valid: false,
      message: 'Nickname must be at most 50 characters long',
    };
  }

  const nicknameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      valid: false,
      message: 'Nickname can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return { valid: true };
}

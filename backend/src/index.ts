import { UserModel } from './models/user.model';
import { hashPassword, comparePassword, validatePasswordStrength } from './utils/password.utils';
import { generateToken, verifyToken, extractTokenFromHeader } from './utils/jwt.utils';
import { validateEmail, validateNickname } from './utils/validation.utils';
import { toPublicUser } from './types/user.types';
import type { User, UserPublic, UserCreateInput, UserUpdateInput } from './types/user.types';
import type { JwtPayload } from './utils/jwt.utils';

// Export all modules
export {
  // Models
  UserModel,
  
  // Utils
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  validateEmail,
  validateNickname,
  toPublicUser,
};

// Export types
export type {
  User,
  UserPublic,
  UserCreateInput,
  UserUpdateInput,
  JwtPayload,
};

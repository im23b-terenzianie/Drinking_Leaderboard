export interface User {
  id: number;
  nickname: string;
  email: string;
  password_hash: string;
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateInput {
  nickname: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
}

export interface UserUpdateInput {
  nickname?: string;
  email?: string;
  avatar_url?: string;
}

export interface UserPublic {
  id: number;
  nickname: string;
  email: string;
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

// Omit password_hash from user object for public consumption
export function toPublicUser(user: User): UserPublic {
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

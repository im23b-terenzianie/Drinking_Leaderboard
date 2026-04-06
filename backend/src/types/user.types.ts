export interface User {
  id: number;
  nickname: string;
  total_points: number;
  created_at: Date;
}

export interface UserCreateInput {
  nickname: string;
}

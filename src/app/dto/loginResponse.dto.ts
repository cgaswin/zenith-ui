export interface LoginResponseDTO {
  token: string;
  userId: string;
  roleId: string;
  username: string;
  role: 'ATHLETE' | 'COACH'|'ADMIN';
}


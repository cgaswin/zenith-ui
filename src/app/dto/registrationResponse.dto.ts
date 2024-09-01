export interface RegistrationResponseDTO {
  userId: string;
  name: string;
  username: string;
  email: string;
  role: 'ATHLETE' | 'COACH';
}


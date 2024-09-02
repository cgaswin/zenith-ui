export interface CoachDTO {
  id: string;
  name: string;
  gender: string;
  dob: string;
  category: string;
  description?: string;
  photoUrl?: string;
  achievements: string[];
  acceptingRequests: boolean;
}
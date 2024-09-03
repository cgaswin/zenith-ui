import { z } from 'zod';

export const CoachingRequestRequestSchema = z.object({
  athleteId: z.string(),
  coachId: z.string()
});

export type CoachingRequestRequestDTO = z.infer<typeof CoachingRequestRequestSchema>;
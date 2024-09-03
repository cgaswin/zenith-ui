import { z } from 'zod';

export const CoachingStatusSchema = z.object({
  hasCoach: z.boolean(),
  coachName: z.string().optional(),
  coachId: z.string().optional(),
  requestStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NONE']).optional()
});

export type CoachingStatusDTO = z.infer<typeof CoachingStatusSchema>;
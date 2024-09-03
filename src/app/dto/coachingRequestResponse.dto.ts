import { z } from 'zod';

export const CoachingRequestResponseSchema = z.object({
  id: z.string(),
  athlete: z.object({
    id: z.string(),
    name: z.string(),
    // Add other athlete properties as needed
  }),
  coach: z.object({
    id: z.string(),
    name: z.string(),
    // Add other coach properties as needed
  }),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  requestDate: z.string().optional() // Make requestDate optional
});

export type CoachingRequestResponseDTO = z.infer<typeof CoachingRequestResponseSchema>;
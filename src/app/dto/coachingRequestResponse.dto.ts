
import { z } from 'zod';

// Define the schema
export const CoachingRequestResponseSchema = z.object({
  id: z.string(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs
  requestDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format'
  }),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']), // Update according to the valid statuses
  coachId: z.string(),
  athleteId: z.string(),
});

// Create TypeScript type from the schema
export type CoachingRequestResponseDTO = z.infer<typeof CoachingRequestResponseSchema>;

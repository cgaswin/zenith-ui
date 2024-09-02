import { z } from 'zod';

export const EventDTO = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  photoUrl: z.string().url(),
  venue: z.string(),
  date: z.string(),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});



export const EventItemDTO = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
});

export const EventRegistrationDTO = z.object({
  id: z.string(),
  eventId: z.string(),
  eventItemId: z.string(),
  athleteId: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  registrationDate: z.string()
});

export type EventDTO = z.infer<typeof EventDTO>;
export type EventItemDTO = z.infer<typeof EventItemDTO>;
export type EventRegistrationDTO = z.infer<typeof EventRegistrationDTO>;
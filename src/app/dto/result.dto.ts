import { z } from 'zod';

export const ResultDTO = z.object({
  id: z.string(),
  eventId: z.string().nullable(),
  eventName: z.string().nullable(),
  eventItemId: z.string().nullable(),
  eventItemName: z.string().nullable(),
  athleteId: z.string().nullable(),
  athleteName: z.string().nullable(),
  score: z.number(),
  publishedDate: z.string().transform(str => new Date(str))
});

export type ResultDTO = z.infer<typeof ResultDTO>;

export const ResultRequestDTO = z.object({
  eventId: z.string(),
  eventItemId: z.string(),
  athleteId: z.string(),
  score: z.number()
});

export type ResultRequestDTO = z.infer<typeof ResultRequestDTO>;
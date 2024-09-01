import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string(),
  role: z.enum(['athlete', 'coach']),
  category: z.string().min(1, 'Category is required').max(50, 'Category must be 50 characters or less'),
  description: z.string().optional(),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .gif formats are supported.'
    ),
});

const athleteSchema = baseSchema.extend({
  role: z.literal('athlete'),
  height: z.number().min(50, 'Height must be at least 50 cm').max(250, 'Height must be 250 cm or less'),
  weight: z.number().min(20, 'Weight must be at least 20 kg').max(300, 'Weight must be 300 kg or less'),
});

const coachSchema = baseSchema.extend({
  role: z.literal('coach'),
  achievements: z.array(z.string()).min(3, 'At least 3 achievements are required').max(3, 'Maximum 3 achievements allowed'),
});

export const signupSchema = z.discriminatedUnion('role', [athleteSchema, coachSchema])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AthleteData = z.infer<typeof athleteSchema>;
export type CoachData = z.infer<typeof coachSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;  
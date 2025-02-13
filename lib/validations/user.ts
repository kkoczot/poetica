import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1),
    name: z.string().min(3, {message: "Minimum 3 characters"}).max(30, {message: "Maximum 30 characters"}),
    username: z.string().min(3, {message: "Minimum 3 characters"}).max(30, {message: "Maximum 30 characters"}),
    bio: z.string().min(3, {message: "Minimum 3 characters"}).max(500, {message: "Maximum 500 characters"}),
});
import * as z from 'zod';

export const PoemValidation = z.object({
    title: z.string().min(3, {message: "Minimum 3 characters"}).max(50, {message: "Maximum 50 characters"}),
    type: z.string().min(3, {message: "You must choose a type for your poem!"}),
    content: z.string().min(3, {message: "Minimum 3 characters"}).max(1600, {message: "Maximum 1600 characters"}),
});

export const EditPoemValidation = z.object({
    title: z.string().min(3, {message: "Minimum 3 characters"}).max(50, {message: "Maximum 50 characters"}),
    type: z.string().optional(),
    content: z.string().min(3, {message: "Minimum 3 characters"}).max(1600, {message: "Maximum 1600 characters"}),
    folderDest: z.string().optional(),
})

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  });
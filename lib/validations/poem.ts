import * as z from 'zod';

export const PoemValidation = z.object({
    title: z.string().min(3, {message: "Minimum 3 characters"}).max(50, {message: "Maximum 50 characters"}),
    type: z.string().min(3, {message: "You must choose a type for your poem!"}),
    tag1: z.string().min(3, {message: "At least 1 tag of 3 characters is required!"}).max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    tag2: z.string().max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    tag3: z.string().max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    content: z.string().min(3, {message: "Minimum 3 characters"}).max(2500, {message: "Maximum 2500 characters"}),
});

export const EditPoemValidation = z.object({
    title: z.string().min(3, {message: "Minimum 3 characters"}).max(50, {message: "Maximum 50 characters"}),
    type: z.string().optional(),
    folderDest: z.string().optional(),
    tag1: z.string().min(3, {message: "At least 1 tag of 3 characters is required!"}).max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    tag2: z.string().max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    tag3: z.string().max(50, {message: "Maximum 50 characters"}).refine((str) => !str.includes('#'), {message: "String cannot contain # symbol"}),
    content: z.string().min(3, {message: "Minimum 3 characters"}).max(2500, {message: "Maximum 2500 characters"}),
})

export const CommentValidation = z.object({
    thread: z.string().min(3, { message: "Minimum 3 characters." }),
  });
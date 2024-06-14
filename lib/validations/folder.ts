import * as z from "zod";

export const FolderValidation = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters." }).max(50, { message: "Maximum 50 characters." }),
  description: z.string().max(250, { message: "Maximum 250 characters." }),
  authorId: z.string(),
  shared: z.boolean(),
});

export const EditFolderValidation = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters." }).max(50, { message: "Maximum 50 characters." }),
  description: z.string().max(250, { message: "Maximum 250 characters." }),
  shared: z.boolean(),
})
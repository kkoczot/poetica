"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { EditFolderValidation } from "@/lib/validations/folder";
import { editFolder } from "@/lib/actions/folder.actions";
import { Input } from "../ui/input";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

interface Props {
  folder: {
    folderId: string;
    authorId: string;
    title: string;
    description: string;
    shared: boolean;
  },
  userId: string;
}

function EditFolder({ folder, userId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof EditFolderValidation>>({
    resolver: zodResolver(EditFolderValidation),
    defaultValues: {
      title: folder.title,
      description: folder.description,
      shared: folder.shared,
    },
  })

  const onSubmit = async (values: z.infer<typeof EditFolderValidation>) => {
    setIsLoading(true);
    await editFolder({
      folderId: folder.folderId,
      title: values.title,
      description: values.description,
      shared: values.shared,
    });

    setIsLoading(false);
    router.back();
  }

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Title
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Description
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={8}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shared"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none ">
                <FormLabel className="text-base-semibold text-light-2">
                  Shared: Folder {field.value ? "available for users" : "not available for users"}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-8">
          <Button type="submit" disabled={isLoading} className={`bg-green-700 hover:bg-green-700/50 ${isLoading && "bg-green-500"}`}>
            {isLoading ? "Editing Folder..." : "Edit Folder"}
          </Button>
          <Link href={`/profile/${userId}/${folder.folderId}/`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-foreground hover:bg-green-700/50 h-10 px-4 py-2 bg-green-700">
            Back to the folder
          </Link>
        </div>
      </form>
    </Form>
  )

}

export default EditFolder;
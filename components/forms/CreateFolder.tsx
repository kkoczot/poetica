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

import { FolderValidation } from "@/lib/validations/folder";
import { createFolder } from "@/lib/actions/folder.actions";
import { Input } from "../ui/input";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

interface Props {
  userId: string,
}

function CreateFolder({ userId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FolderValidation>>({
    resolver: zodResolver(FolderValidation),
    defaultValues: {
      title: "",
      description: "",
      authorId: userId,
      shared: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof FolderValidation>) => {
    setIsLoading(true);
    await createFolder({
      title: values.title,
      description: values.description,
      authorId: values.authorId,
      shared: values.shared,
    })

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
            {isLoading ? "Creating Folder..." : "Create Folder"}
          </Button>
          <Button type="button" disabled={isLoading} className="bg-green-700 hover:bg-green-700/50" onClick={() => router.back()}>Go back</Button>
        </div>
      </form>
    </Form>
  )

}

export default CreateFolder;
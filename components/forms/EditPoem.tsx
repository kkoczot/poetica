"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { EditPoemValidation } from "@/lib/validations/poem";
import { Input } from "../ui/input";
import { useState } from "react";
import { editPoem } from "@/lib/actions/poem.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { poemTypes } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  poem: {
    poemId: string;
    folderId: string;
    authorId: string;
    title: string;
    content: string;
    type: string;
  };
  profileId: string;
  folders: any;
}

function EditPoem({ poem, profileId, folders }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof EditPoemValidation>>({
    resolver: zodResolver(EditPoemValidation),
    defaultValues: {
      title: poem.title,
      type: undefined,
      folderDest: undefined,
      content: poem.content,
    },
  })

  const onSubmit = async (values: z.infer<typeof EditPoemValidation>) => {
    setIsLoading(true);
    if ((values.title != poem.title) || (values.content != poem.content) || (values.type != poem.type && values.type != undefined) || (values.folderDest != poem.folderId && values.folderDest != undefined)) {
      await editPoem({
        poemId: poem.poemId,
        title: values.title,
        content: values.content,
        type: values.type || poem.type || undefined,
        folderDest: values.folderDest == poem.folderId ? undefined : values.folderDest,
        oldFolder: poem.folderId
      });
    }

    setIsLoading(false);
    router.push(`/profile/${profileId}`);
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
              <FormControl className="no-focus border border-dark-4 bg-dark-3">
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">Poem type | {poem.type}</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-2">
                  <SelectTrigger>
                    <SelectValue placeholder="Select poem type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-4">
                  {
                    poemTypes.map((pType: any) => (
                      <SelectItem value={pType.poemType} key={pType.poemType} className="no-focus border border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">{pType.poemType}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the best type for your poem
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="folderDest"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">Change folder | {folders.find((folder: any) => folder._id.toString() === poem.folderId).title}</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-2">
                  <SelectTrigger>
                    <SelectValue placeholder="Move poem to the folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-4">
                  {
                    folders.map((fol: any) => (
                      <SelectItem value={fol._id} key={fol._id} className="no-focus border border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer">{fol.title}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormDescription>
                Change the home folder for this poem
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3">
                <Textarea
                  className="account-form_input no-focus"
                  rows={40}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-8">
          <Button type="submit" disabled={isLoading} className={`bg-green-700 hover:bg-green-700/50 ${isLoading && "bg-green-500"}`}>
            {isLoading ? "Editing Poem..." : "Edit Poem"}
          </Button>
          <Link href={pathname.slice(0, -4)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-foreground hover:bg-green-700/50 h-10 px-4 py-2 bg-green-700">
            Back to the poem
          </Link>
        </div>
      </form>
    </Form>
  )

}

export default EditPoem;
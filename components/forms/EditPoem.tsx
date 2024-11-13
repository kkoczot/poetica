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
    type: string;
    tags: string[];
    content: string;
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
      tag1: poem.tags[0] || '',
      tag2: poem.tags[1] || '',
      tag3: poem.tags[2] || '',
      folderDest: undefined,
      content: poem.content,
    },
  })

  const onSubmit = async (values: z.infer<typeof EditPoemValidation>) => {
    if(isLoading) return;
    setIsLoading(true);

    // const toCheck: (keyof z.infer<typeof EditPoemValidation>)[]  = ["title", "content", "type", "folderDest", "tag1", "tag2", "tag3"];

    // console.log(toCheck.map((checkItem: string) => {
    //   if(checkItem.includes("tag")) {

    //   } else if()
    //   values[checkItem] != poem[checkItem] && values[checkItem] != undefined
    // }));

    // if(toCheck.map((checkItem: string) => values[checkItem] != poem[checkItem] && values[checkItem] != undefined).some(item => item)) {
    //   console.log("Wykryto zmiany!");
    // } else {
    //   console.log("Zmian nie wykryto!");
    // }

    // values.title != poem.title) 
    // (values.content != poem.content) 
    // (values.type != poem.type && values.type != undefined)
    // (values.folderDest != poem.folderId && values.folderDest != undefined
    // values.tag1 != poem.tags[0]
    // values.tag2 != poem.tags[1] && values.tag2 != undefined
    // values.tag3 != poem.tags[2] && values.tag3 != undefined
    
    // console.log(values);

    if((values.title != poem.title)
      || (values.content != poem.content)
      || (values.type != poem.type && values.type != undefined)
      || (values.folderDest != poem.folderId && values.folderDest != undefined)
      || (values.tag1 != poem.tags[0] && values.tag1 != '')
      || (values.tag2 != poem.tags[1] && values.tag2 != '')
      || (values.tag3 != poem.tags[2] && values.tag3 != '')) {
        if(!values.tag2 && values.tag3) {
          values.tag2 = values.tag3;
          values.tag3 = '';
        }
      await editPoem({
        poemId: poem.poemId,
        title: values.title,
        content: values.content,
        tag1: values.tag1.trim(),
        tag2: values.tag2.trim(),
        tag3: values.tag3.trim(),
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
                      <SelectItem
                        key={pType.poemType}
                        value={pType.poemType}
                        className="no-focus border border-dark-4 bg-dark-3 text-light-2 hover:cursor-pointer"
                      >
                        <span className="flex gap-2">
                          <div className="h-3 w-3 rounded-full self-center mr-1" style={{ backgroundColor: pType.color }} />
                          {pType.poemType}
                        </span>
                      </SelectItem>
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
        <div>
          <p className="text-base-semibold text-light-2 mb-3">Tags</p>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="tag1"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    #Tag1
                  </FormLabel>
                  <FormControl className="no-focus border border-dark-4 bg-dark-3">
                    <Input
                      className="account-form_input no-focus"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    # sign will be added automatically
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag2"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    #Tag2
                  </FormLabel>
                  <FormControl className="no-focus border border-dark-4 bg-dark-3">
                    <Input
                      className="account-form_input no-focus"
                      type="text"
                      {...field}
                      disabled={!Boolean(form.watch().tag1.trim())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag3"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base-semibold text-light-2">
                    #Tag3
                  </FormLabel>
                  <FormControl className="no-focus border border-dark-4 bg-dark-3">
                    <Input
                      className="account-form_input no-focus"
                      type="text"
                      {...field}
                      disabled={!Boolean(form.watch().tag1.trim()) || !Boolean(form.watch().tag2.trim())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
                  className="account-form_input no-focus custom-scrollbar"
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
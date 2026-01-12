"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod";
import { PoemValidation } from "@/lib/validations/poem";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createPoem } from "@/lib/actions/poem.actions";
import { poemTypes } from "@/constants";
import Link from "next/link";

interface Props {
  folderId: string,
  userId: string,
}


function CreatePoem({ folderId, userId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof PoemValidation>>({
    resolver: zodResolver(PoemValidation),
    defaultValues: {
      title: '',
      type: '',
      tag1: '',
      tag2: '',
      tag3: '',
      content: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof PoemValidation>) => {
    if(isLoading) return;
    setIsLoading(false);
    if(!values.tag2.trim() && values.tag3.trim()) {
      values.tag2 = values.tag3;
      values.tag3 = '';
    }
    await createPoem({
      folderId: folderId,
      authorId: userId,
      title: values.title,
      type: values.type,
      tag1: values.tag1.trim(),
      tag2: values.tag2.trim(),
      tag3: values.tag3.trim(),
      content: values.content,
    })
    setIsLoading(true);
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
              <FormLabel className="text-base-semibold text-light-2">Poem type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <p className="text-base-semibold text-light-2 mb-2 md:mb-3">Tags</p>
          <FormDescription className="mb-3 hidden max-md:block">
          # sign will be added automatically
          </FormDescription>
          <div className="flex gap-4 max-md:flex-col">
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
                </FormItem>
              )}
              />
          </div>
          <FormDescription className="invisible md:visible">
            # sign will be added automatically
          </FormDescription>
        </div>
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
            {isLoading ? "Creating Poem..." : "Create Poem"}
          </Button>
          {pathname.includes("/profile/") && <Link href={pathname.slice(0, -11)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-foreground hover:bg-green-700/50 h-10 px-4 py-2 bg-green-700">
            Back to the folder
          </Link>}
        </div>
      </form>
    </Form>
  )
}

export default CreatePoem;
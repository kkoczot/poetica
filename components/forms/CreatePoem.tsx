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
      content: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof PoemValidation>) => {
    setIsLoading(false);
    await createPoem({
      folderId: folderId,
      authorId: userId,
      title: values.title,
      type: values.type,
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
/*
Widzę ja zmiany i inaczej miarkuję swe czucie
Gdy potok znany topi serce i dobija do głowy
Czuję wagę myśli, których zadaniem mnie trucie
Gdy usta nasze nie prowadzą rozmowy.

Nie wiem kiedy inaczej zacząłem spoglądać na ciebie
Kiedy to się stało? Czy ja byłem sobą?
Ah, myśli o tobie kiełkują we mnie jak w glebie
Bylibyśmy piękną świata ozdobą.

Bo sarnie twe oczy patrzą na mnie z dołu
A z góry ja patrzę na śliczne twe oczęta
Siądźmy razem przy kominku, usiądźmy do stołu

W smak jesteś mi ty, nie inne dziewczęta
Widzę kolor twych włosów, płomień uczucia
Niczym przewodnika dla ciał naszych snucia.
*/
"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { messagesRef } from "@/lib/firebase/converters/message";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  input: z.string().max(1000),
});

const ChatInput = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.input.length === 0 || !session?.user) {
      return;
    }

    // Restrict F2P Users

    addDoc(messagesRef(chatId), {
      input: values.input,
      timestamp: serverTimestamp(),
      user: {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        image: session.user.image as string,
      },
    });
  };

  return (
    <div className="sticky bottom-0 m-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border dark:bg-slate-800"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className="border-none bg-t-transparent dark:placeholder:text-white/70"
                    placeholder="Enter message in ANY language..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-violet-600 text-white">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;

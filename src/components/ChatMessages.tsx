"use client";

import { Message, sortedMessagesRef } from "@/lib/firebase/converters/message";
import { useLanguageStore } from "@/lib/store";
import { MessageCircleIcon } from "lucide-react";
import { Session } from "next-auth";
import { createRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

type Props = {
  chatId: string;
  session: Session | null | undefined;
  initialMessages: Message[];
};

const ChatMessages = ({ chatId, initialMessages, session }: Props) => {
  const { language } = useLanguageStore();
  const messagesEndRef = createRef<HTMLDivElement>();

  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="p-5">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col justify-center text-center items-center p-20 rounded-xl space-y-2 bg-indigo-400 text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
          <h2>
            <span className="font-bold">Invite a friend</span> &{" "}
            <span className="font-bold">
              Send your first message in ANY language
            </span>{" "}
            below to get started!
          </h2>
          <p>The AI will auto-detect & translate it all for you</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

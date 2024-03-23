"use client";

import {
  ChatMember,
  chatMembersCollectionGroupRef,
} from "@/lib/firebase/converters/chat-members";
import { useCollectionData } from "react-firebase-hooks/firestore";
import CreateChatButton from "./CreateChatButton";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Message,
  limitedSortedMessagesRef,
} from "@/lib/firebase/converters/message";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { prettyUUID } from "@/lib/utils";

const Row = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, loading, error] = useCollectionData<Message>(
    limitedSortedMessagesRef(chatId)
  );

  const row = (message?: Message) => {
    return (
      <div
        key={chatId}
        onClick={() => router.push(`/chat/${chatId}`)}
        className="flex p-5 items-center space-x-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-700"
      >
        <UserAvatar
          name={message?.user?.name! || session?.user?.name!}
          image={message?.user?.image! || session?.user?.image!}
        />
        <div className="flex-1">
          <p className="font-bold">
            {!message && "New Chat"}
            {message &&
              [message?.user.name || session?.user.name]
                .toString()
                .split(" ")[0]}
          </p>
          {/*<p className="text-gray-400 line-clamp-1">{message?.translated?.[language] || "Get the conversation started..."}</p>*/}
        </div>
        <div className="text-xs text-gray-400 text-right">
          <p className="mx-auto">
            {message
              ? new Date(message.timestamp.toDate()).toLocaleTimeString()
              : "No messages yet"}
          </p>
          <p>chat #{prettyUUID(chatId)}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading && (
        <div className="flex p-5 items-ceter space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}
      {messages?.length === 0 && !loading && row()}
      {messages?.map((message) => row(message))}
    </div>
  );
};

export default ({ initialChats }: { initialChats: ChatMember[] }) => {
  const { data: session } = useSession();

  const [members, loading, error] = useCollectionData<ChatMember>(
    session && chatMembersCollectionGroupRef(session?.user.id),
    { initialValue: initialChats }
  );

  if (members?.length === 0)
    return (
      <div className="flex flex-col justify-center items-center pt-40 space-y-2">
        <MessageSquare className="h-10 w-10" />
        <h1 className="text-5xl font-extralight">Welcome!</h1>
        <h2 className="pb-10">
          Lets get you started by creating your first chat!
        </h2>
        <CreateChatButton isLarge />
      </div>
    );

  return (
    <div>
      {members?.map((member, i) => (
        <Row chatId={member.chatId} key={i} />
      ))}
    </div>
  );
};

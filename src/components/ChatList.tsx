"use client";

import {
  ChatMember,
  chatMembersCollectionGroupRef,
} from "@/lib/firebase/converters/chat-members";
import { useCollectionData } from "react-firebase-hooks/firestore";
import CreateChatButton from "./CreateChatButton";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

const Row = ({ chatId }: { chatId: string }) => {
  // const [messages, loading, error] = useCollectionData<Message>(limitedSortedMessagesRef(chatId))

  return <div></div>;
};

export default ({ initialChats }: { initialChats: ChatMember[] }) => {
  const { data: session } = useSession();

  const [members, loading, error] = useCollectionData<ChatMember>(
    session && chatMembersCollectionGroupRef(session?.user.id),
    { initialValue: initialChats },
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
    <div>{members?.map((member, i) => <Row chatId={member.chatId} />)}</div>
  );
};

import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { authOptions } from "@/lib/auth";
import { sortedMessagesRef } from "@/lib/firebase/converters/message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";

export default async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const session = await getServerSession(authOptions);

  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => ({ ...doc.data(), timestamp: null, translatedAt: null })
  );

  return (
    <>
      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>
      <ChatInput chatId={chatId} />
    </>
  );
};

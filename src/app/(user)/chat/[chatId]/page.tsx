import AdminControls from "@/components/AdminControls";
import ChatInput from "@/components/ChatInput";
import ChatMembersBadges from "@/components/ChatMembersBadges";
import ChatMessages from "@/components/ChatMessages";
import { authOptions } from "@/lib/auth";
import { chatMembersRef } from "@/lib/firebase/converters/chat-members";
import { sortedMessagesRef } from "@/lib/firebase/converters/message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const session = await getServerSession(authOptions);

  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => ({ ...doc.data(), timestamp: null, translatedAt: null })
  );

  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!hasAccess) redirect("/chat?error=permission");

  return (
    <>
      <AdminControls chatId={chatId} />
      <ChatMembersBadges chatId={chatId} />
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

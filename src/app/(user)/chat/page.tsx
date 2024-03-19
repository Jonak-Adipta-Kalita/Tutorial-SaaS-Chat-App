import ChatList from "@/components/ChatList";
import { authOptions } from "@/lib/auth";
import { chatMembersCollectionGroupRef } from "@/lib/firebase/converters/chat-members";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";

export default async ({
  searchParams: { error },
}: {
  params: {};
  searchParams: { error: string };
}) => {
  const session = await getServerSession(authOptions);

  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id!),
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return (
    <div>
      <ChatList initialChats={initialChats} />
    </div>
  );
};

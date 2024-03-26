import ChatList from "@/components/ChatList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { chatMembersCollectionGroupRef } from "@/lib/firebase/converters/chat-members";
import { getDocs } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async ({
  searchParams: { error },
}: {
  params: {};
  searchParams: { error: string };
}) => {
  const session = await getServerSession(authOptions);

  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id!)
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return (
    <div>
      {error && (
        <div className="m-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex">
              <p className="flex-1">
                You do not have permission to view this chat. <br />{" "}
                <span className="font-bold">
                  Please ask the chat admin to add you to the chat.
                </span>{" "}
              </p>
              <Link href="/chat" replace>
                <Button variant="destructive">Dismiss</Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <ChatList initialChats={initialChats} />
    </div>
  );
};

import ChatInput from "@/components/ChatInput";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <ChatInput chatId={chatId} />
    </>
  );
};

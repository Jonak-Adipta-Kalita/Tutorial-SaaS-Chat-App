import { adminDB } from "@/lib/firebase/admin";

export const POST = async (req: Request) => {
  const { docRefId, chatId }: { docRefId: string; chatId: string } =
    await req.json();
  const docRef = adminDB
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(docRefId);
};

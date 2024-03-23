import { adminDB } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "firebase/auth";

export const POST = async (req: Request) => {
  const { docRefId, chatId }: { docRefId: string; chatId: string } =
    await req.json();
  const docRef = adminDB
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(docRefId);

  const { input, timestamp, user } = (await docRef.get()).data() as {
    input: string;
    timestamp: Timestamp;
    user: User;
  };

  try {
    return Response.json({ recieved: true });
  } catch (err: any) {
    await docRef.set({ error: { message: err.message } }, { merge: true });
    return new Response(err, { status: err.status });
  }
};

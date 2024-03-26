import { adminDB } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  const { chatId } = await req.json();
  const ref = adminDB.collection("chats").doc(chatId);

  const adminId = (
    await ref.collection("members").where("isAdmin", "==", true).get()
  ).docs[0].data().userId;
  const userId = req.headers.get("Authorization")!.split(" ")[1];

  if (adminId !== userId)
    return NextResponse.json({ success: false }, { status: 401 });

  const bulkWriter = adminDB.bulkWriter();
  const MAX_RETRY_ATTEMPTS = 5;

  bulkWriter.onWriteError((error) => {
    return error.failedAttempts < MAX_RETRY_ATTEMPTS;
  });

  try {
    await adminDB.recursiveDelete(ref, bulkWriter);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

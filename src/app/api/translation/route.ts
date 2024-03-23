import { adminDB } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "firebase/auth";
import { LanguagesSupportedMap } from "@/lib/store";
import { translate } from "@vitalets/google-translate-api";

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
    const tasks = Object.keys(LanguagesSupportedMap).map(async (language) => {
      return {
        language,
        translation: (
          await translate(input, {
            to: language === "zh" ? "zh-cn" : language,
          })
        ).text,
      };
    });

    try {
      const translations = await Promise.all(tasks);

      await docRef.set(
        {
          translated: translations.reduce(
            (acc, { language, translation }) => ({
              ...acc,
              [language]: translation,
            }),
            {}
          ),
          translatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (err: any) {
      await docRef.set(
        { error: { message: err.message, status: err.status } },
        { merge: true }
      );
      return new Response(err, { status: err.status });
    }

    return Response.json({ recieved: true });
  } catch (err: any) {
    await docRef.set(
      { error: { message: err.message, status: err.status } },
      { merge: true }
    );
    return new Response(err, { status: err.status });
  }
};

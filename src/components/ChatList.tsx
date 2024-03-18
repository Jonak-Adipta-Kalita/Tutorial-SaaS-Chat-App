import { authOptions } from "@/lib/auth";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";

export default async () => {
  const session = await getServerSession(authOptions);

  // const chatsSnapshot = await getDocs()

  return <div></div>;
};

"use client";

import { useSubscriptionStore } from "@/lib/store";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default () => {
  const { subscription } = useSubscriptionStore();
  const isPro = subscription?.role === "pro";

  const router = useRouter();

  if (subscription === undefined || isPro) return null;

  return (
    <Button
      onClick={() => router.push("/register")}
      className="w-full rounded-none bg-gradient-to-r from-[#7775D6] to-[#E935C1] text-center text-white px-5 py-2"
    >
      Upgrade to Pro to unlock all features!
    </Button>
  );
};

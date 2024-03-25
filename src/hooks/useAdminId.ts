"use client";

import { chatMemberAdminRef } from "@/lib/firebase/converters/chat-members";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const useAdminId = (chatId: string) => {
  const [adminId, setAdminId] = useState<string>("");

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const adminId = (await getDocs(chatMemberAdminRef(chatId))).docs.map(
        (doc) => doc.id
      )[0];

      setAdminId(adminId);
    };
    fetchAdminStatus();
  }, [chatId]);

  return adminId;
};

export default useAdminId;

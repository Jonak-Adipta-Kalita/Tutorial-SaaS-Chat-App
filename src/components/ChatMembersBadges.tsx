"use client";

import useAdminId from "@/hooks/useAdminId";
import {
  ChatMember,
  chatMembersRef,
} from "@/lib/firebase/converters/chat-members";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";

const MemberBadge = ({
  member,
  isAdmin,
}: {
  member: ChatMember;
  isAdmin: boolean;
}) => (
  <Badge
    variant="secondary"
    className="h-14 p-5 pl-2 pr-5 space-x-2"
    isAdmin={isAdmin}
  >
    <div className="flex items-center space-x-2">
      <UserAvatar name={member.email} image={member.image} />
    </div>
    <div>
      <p>{member.email}</p>
      {isAdmin && (
        <p className="text-indigo-400 animate-pulse text-left">Admin</p>
      )}
    </div>
  </Badge>
);

const ChatMembersBadges = ({ chatId }: { chatId: string }) => {
  const [members, loading, error] = useCollectionData<ChatMember>(
    chatMembersRef(chatId)
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const adminId = useAdminId(chatId);

  if (loading && !members) return <LoadingSpinner />;

  return (
    <div className="py-2 border rounded-xl m-5">
      <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 p-2">
        {members?.map((member) =>
          member.userId !== adminId ? (
            <Dialog
              open={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              key={member.email}
            >
              <DialogTrigger>
                <MemberBadge
                  member={member}
                  key={member.email}
                  isAdmin={member.userId === adminId}
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <p>Hello World</p>
              </DialogContent>
            </Dialog>
          ) : (
            <MemberBadge
              member={member}
              key={member.email}
              isAdmin={member.userId === adminId}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ChatMembersBadges;

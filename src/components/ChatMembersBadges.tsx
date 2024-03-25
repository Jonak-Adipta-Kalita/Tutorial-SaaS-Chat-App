"use client";

import useAdminId from "@/hooks/useAdminId";
import {
  ChatMember,
  chatMemberRef,
  chatMembersRef,
} from "@/lib/firebase/converters/chat-members";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { deleteDoc } from "firebase/firestore";

const MemberBadge = ({
  member,
  adminId,
}: {
  member: ChatMember;
  adminId: string;
}) => {
  const { data: session } = useSession();
  return (
    <Badge
      variant="secondary"
      className="h-14 p-5 pl-2 pr-5 space-x-[12px]"
      isAdmin={session?.user.id === adminId}
    >
      <div className="flex items-center space-x-2">
        <UserAvatar name={member.email} image={member.image} />
      </div>
      <div>
        <p
          className={
            member.userId === adminId ? "text-indigo-400 animate-pulse" : ""
          }
        >
          {member.email}
        </p>
      </div>
    </Badge>
  );
};

const NonAdminMemberBadgeForAdmin = ({
  member,
  chatId,
}: {
  member: ChatMember;
  chatId: string;
}) => {
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const adminId = useAdminId(chatId);

  const removeMember = async () => {
    toast({
      title: "Removing Member",
      description: "Please wait while we remove the member!",
    });

    try {
      await deleteDoc(chatMemberRef(chatId, member.userId));

      toast({
        title: `Removed ${member.email}`,
        description: "The member can't interact with the Chat Room anymore!",
        className: "bg-green-600 text-white",
      });
    } catch (err) {
      toast({
        title: `Member couldn't be removed!`,
        description: "There was a error in removing the member",
        variant: "destructive",
      });
    }

    setIsRemoveMemberModalOpen(false);
  };

  return (
    <Dialog
      open={isRemoveMemberModalOpen}
      onOpenChange={setIsRemoveMemberModalOpen}
    >
      <DialogTrigger>
        <MemberBadge member={member} adminId={adminId} key={member.email} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Remove <span className="text-gray-500">{member.email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center space-x-4">
          <Button
            className="w-full"
            variant={"destructive"}
            onClick={() => removeMember()}
          >
            Yes
          </Button>
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => setIsRemoveMemberModalOpen(false)}
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChatMembersBadges = ({ chatId }: { chatId: string }) => {
  const [members, loading, error] = useCollectionData<ChatMember>(
    chatMembersRef(chatId)
  );
  const { data: session } = useSession();
  const adminId = useAdminId(chatId);

  if (loading && !members) return <LoadingSpinner />;

  return (
    <div className="py-2 border rounded-xl m-5">
      <div className="flex gap-2 p-2 overflow-y-auto">
        {members?.map((member) =>
          session?.user.id === adminId && member.userId !== adminId ? (
            <NonAdminMemberBadgeForAdmin
              chatId={chatId}
              member={member}
              key={member.email}
            />
          ) : (
            <MemberBadge member={member} key={member.email} adminId={adminId} />
          )
        )}
      </div>
    </div>
  );
};

export default ChatMembersBadges;

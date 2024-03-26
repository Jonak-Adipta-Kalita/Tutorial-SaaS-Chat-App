"use client";

import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import useAdminId from "@/hooks/useAdminId";
import { MouseEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

const DeleteChatButton = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId(chatId);

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    toast({
      title: "Deleting Chat",
      description: "Please wait while we delete the chat...",
    });

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.id}`,
      },
      body: JSON.stringify({ chatId }),
    })
      .then((res) => {
        toast({
          title: "Success",
          description: "Your chat has been deleted!",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
        router.replace("/chat");
      })
      .finally(() => setOpen(false));
  };

  return (
    session?.user.id === adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Chat</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 space-x-2">
            <Button variant={"destructive"} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default DeleteChatButton;

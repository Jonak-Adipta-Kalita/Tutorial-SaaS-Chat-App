"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useSubscriptionStore } from "@/lib/store";
import LoadingSpinner from "./LoadingSpinner";
import { StarIcon } from "lucide-react";

type Props = {
  session: Session | null;
};

const UserButton = ({ session }: Props) => {
  const { subscription } = useSubscriptionStore();

  if (!session)
    return (
      <Button variant={"outline"} onClick={() => signIn("google")}>
        Sign In
      </Button>
    );

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar image={session.user?.image!} name={session.user?.name!} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {subscription === undefined && (
            <DropdownMenuItem className="flex items-center justify-center">
              <LoadingSpinner />
            </DropdownMenuItem>
          )}
          {subscription?.role === "pro" && (
            <>
              <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#E935C1] animate-pulse">
                <StarIcon fill="#953C1" size={20} />
                <p>PRO</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-center">
                Manage
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            className="flex items-center justify-center"
            onClick={() => signOut()}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default UserButton;

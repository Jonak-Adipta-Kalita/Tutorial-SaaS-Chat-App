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
import SignInButton from "./SignInButton";

type Props = {
  session: Session | null;
};

const UserButton = ({ session }: Props) => {
  if (!session) return <SignInButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          image="https://avatars.githubusercontent.com/u/70377522?v=4"
          name="Jonak Adipta Kalita"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;

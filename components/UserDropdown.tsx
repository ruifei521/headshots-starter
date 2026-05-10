"use client";

import { AvatarIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";

type UserDropdownProps = {
  user: User;
};

export default function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <AvatarIcon className="h-6 w-6 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[101]">
        <DropdownMenuLabel className="text-primary text-center overflow-hidden text-ellipsis">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action="/auth/sign-out" method="post">
          <Button
            type="submit"
            className="w-full text-left"
            variant="ghost"
          >
            Log out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

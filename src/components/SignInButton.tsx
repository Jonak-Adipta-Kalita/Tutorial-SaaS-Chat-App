"use client";

import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <Button variant={"outline"} onClick={() => signIn("google")}>
      Sign In
    </Button>
  );
};

export default SignInButton;

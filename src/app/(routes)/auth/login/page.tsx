import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - LinkHub",
  description: "Sign in to your LinkHub account",
};

export default function LoginPage() {
  return (
    <div className=" flex h-screen items-center justify-center">
      <Link href={'/'}>
        <Button variant="secondary" className=" absolute top-2 left-2">
          <ArrowLeft />
          back to home
        </Button>
      </Link>
      <LoginForm />;
    </div>
  );
}

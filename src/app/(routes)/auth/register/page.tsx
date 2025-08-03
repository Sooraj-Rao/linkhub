import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up - LinkHub",
  description:
    "Create your LinkHub account and start building your digital presence",
};

export default function RegisterPage() {
  return (
    <div className=" flex h-screen items-center justify-center">
      <Link href={"/"}>
        <Button variant="secondary" className=" absolute top-2 left-2">
          <ArrowLeft />
          back to home
        </Button>
      </Link>
      <RegisterForm />;
    </div>
  );
}

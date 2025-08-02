import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"
import AuthLayout from "@/components/auth/auth-layout"

export const metadata: Metadata = {
  title: "Sign Up - LinkHub",
  description: "Create your LinkHub account and start building your digital presence",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of creators building their digital presence with LinkHub"
    >
      <RegisterForm />
    </AuthLayout>
  )
}

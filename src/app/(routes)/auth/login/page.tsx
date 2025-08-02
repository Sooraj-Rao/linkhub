import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"
import AuthLayout from "@/components/auth/auth-layout"

export const metadata: Metadata = {
  title: "Login - LinkHub",
  description: "Sign in to your LinkHub account",
}

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue building your digital presence">
      <LoginForm />
    </AuthLayout>
  )
}

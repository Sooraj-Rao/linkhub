import { Suspense } from "react"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Testimonials from "@/components/landing/testimonials"
import CTA from "@/components/landing/cta"
import Footer from "@/components/landing/footer"
import Navbar from "@/components/landing/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
          <Features />
          <Testimonials />
          <CTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

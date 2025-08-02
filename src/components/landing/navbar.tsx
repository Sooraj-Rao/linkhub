"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LinkHub
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-dark rounded-lg mt-2">
              <Link href="#features" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                Features
              </Link>
              <Link href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                Pricing
              </Link>
              <Link href="#about" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                About
              </Link>
              <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
                Login
              </Link>
              <Link href="/auth/register" className="block px-3 py-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

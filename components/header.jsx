"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Menu,
  Bot,
  Dumbbell,
  Salad,
  LayoutDashboard,
  Info,
  MapPin,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-4 py-6 bg-black text-white shadow-md">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.ico" alt="GrindAI Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold leading-tight hide-below-200">GrindAI</h1>
        </Link>

        {/* Navigation Links for Desktop */}
        <div className="hidden sm:flex gap-6 text-sm md:text-base items-center">
          <Link href="/ai-assistant" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <Bot className="w-5 h-5" /> AI Assistant
          </Link>
          <Link href="/workouts" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <Dumbbell className="w-5 h-5" /> Workouts
          </Link>
          <Link href="/diet-plans" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <Salad className="w-5 h-5" /> Diet
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/detail" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <Info className="w-5 h-5" /> Details
          </Link>
          <Link href="/nearby-gyms" className="flex items-center gap-1 hover:text-gray-300 py-1">
            <MapPin className="w-5 h-5" /> Nearby Gyms
          </Link>
        </div>

        {/* Always-visible Auth Controls */}
        <div className="flex items-center">
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 py-2 px-4">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden ml-4">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Navigation for Mobile */}
      <div className={cn(
        "flex-col gap-4 mt-4 sm:hidden",
        isOpen ? "flex" : "hidden"
      )}>
        <div className="flex flex-col gap-3 text-sm md:text-base items-start">
          <Link href="/ai-assistant" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <Bot className="w-5 h-5" /> AI Assistant
          </Link>
          <Link href="/workouts" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <Dumbbell className="w-5 h-5" /> Workouts
          </Link>
          <Link href="/diet-plans" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <Salad className="w-5 h-5" /> Diet
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/detail" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <Info className="w-5 h-5" /> Details
          </Link>
          <Link href="/nearby-gyms" className="flex items-center gap-2 hover:text-gray-300 py-1">
            <MapPin className="w-5 h-5" /> Nearby Gyms
          </Link>
        </div>
      </div>
    </nav>
  );
}

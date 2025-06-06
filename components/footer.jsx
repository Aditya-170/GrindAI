import { Dumbbell, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
        {/* Logo and Slogan */}
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-10 h-10 text-white animate-bounce" />
            <h1 className="text-3xl font-bold">GrindAI</h1>
          </div>
          <p className="text-sm text-gray-400 ml-12">
            AI Meets Muscle — Your Smartest Workout Partner!
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 text-left">
          <Link href="/ai-assistant" className="hover:text-gray-300">AI Assistant</Link>
          <Link href="/workouts" className="hover:text-gray-300">Workouts</Link>
          <Link href="/diet-plans" className="hover:text-gray-300">Diet Plans</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/detail" className="hover:text-gray-300">Details</Link>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-end gap-2">
          <h2 className="font-semibold">Connect with us</h2>
          <div className="flex gap-4">
            <a href="https://github.com/Aditya-170" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 hover:text-gray-300" />
            </a>
            <a href="https://www.linkedin.com/in/aditya-kumar-29a30a29b/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-gray-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-gray-300" />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />

      <p className="text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} GrindAI. All rights reserved.
      </p>
    </footer>
  );
}

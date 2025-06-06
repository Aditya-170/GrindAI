"use client";

import Image from "next/image";
import Link from "next/link";
import { Dumbbell, LayoutDashboard, Bot, Salad, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="bg-black text-white px-4 py-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-2 sm:px-4 md:px-10">
        {/* Left: Welcome Text */}
        <div className="flex flex-col gap-4 w-full max-w-xl min-w-0 break-words">
          <div className="text-[clamp(1.5rem,4vw,3rem)] font-bold leading-snug">
            <h1>Welcome to</h1>
            <div className="flex items-center gap-2 mt-2 animate-bounce flex-wrap">
              <Dumbbell className="w-8 h-8 text-white shrink-0" />
              <span className="break-words max-w-full">GrindAI</span>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-300 mt-4 break-words">
            Your personal AI-powered fitness assistant.
          </p>
        </div>

        {/* Right: Responsive Image */}
        <div className="w-full md:w-1/2 max-w-full overflow-hidden min-w-0">
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] ">
            <Image
              src="/Ai_fitness.jpg"
              alt="Fitness AI"
              fill
              className="rounded-xl w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Ask AI Assistant Button */}
      <div className="flex justify-center mt-10">
        <Link href="/ai-assistant">
          <Button className="text-lg px-6 py-3 bg-white text-black hover:bg-gray-200">
            Ask AI Assistant
          </Button>
        </Link>
      </div>

      {/* What We Serve Section */}
      <section className="mt-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          What We Serve
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/dashboard">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Track your workouts, diet, and fitness progress with intuitive graphs and insights all in one dashboard.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai-assistant">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" /> AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Get 24/7 personalized fitness and wellness advice with cutting-edge AI technology tailored just for you.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/diet-plans">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Salad className="w-5 h-5" /> Diet Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Enjoy nutritionist-designed meal plans aligned to your goals—whether it’s muscle gain, weight loss, or maintenance.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/workouts">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" /> Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Access curated and dynamic workout plans that adapt to your level, schedule, and personal preferences.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/detail">
            <Card className="bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" /> Your Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Get insights into your fitness journey, track your progress, and receive personalized suggestion.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </main>
  );
}

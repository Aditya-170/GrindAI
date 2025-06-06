import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DietPlan from "@/models/dietModel";

export async function GET(req) {
  await connectDB();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const plans = await DietPlan.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(plans);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newPlan = await DietPlan.create(body);
  return NextResponse.json(newPlan, { status: 201 });
}

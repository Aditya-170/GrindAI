import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Detail from "@/models/detailModel";

export async function GET(req) {
  await connectDB();
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // ✅ Get all details sorted with latest first
  const details = await Detail.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(details);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newDetail = await Detail.create(body);
  return NextResponse.json(newDetail, { status: 201 });
}

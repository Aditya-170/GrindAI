import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DietPlan from "@/models/dietModel";

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await DietPlan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await DietPlan.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}

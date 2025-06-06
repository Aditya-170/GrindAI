import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Detail from "@/models/detailModel";

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await Detail.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

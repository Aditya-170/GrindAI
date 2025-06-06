import connectDB from "@/lib/db";
import Workout from "@/models/workoutModel";

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const newWorkout = new Workout(body);
    await newWorkout.save();

    return new Response(JSON.stringify({ message: "Workout created successfully!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ message: "Failed to create workout." }), {
      status: 500,
    });
  }
};

export const GET = async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  try {
    await connectDB();
    const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(workouts), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch workouts." }), {
      status: 500,
    });
  }
};
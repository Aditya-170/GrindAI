import connectDB from "@/lib/db";
import Workout from "@/models/workoutModel";

export const PUT = async (req, { params } ) => {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Workout.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) {
      return new Response(JSON.stringify({ message: "Workout not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Workout updated successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ message: "Failed to update workout." }), {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectDB();
    await Workout.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Workout deleted successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ message: "Failed to delete workout." }), {
      status: 500,
    });
  }
};

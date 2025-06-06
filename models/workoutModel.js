import mongoose from "mongoose";

const dailyWorkoutSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  exercises: {
    type: [String],
    required: true,
  },
}, { _id: false });

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk user ID
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    date: {
      type: String, // ISO string
      required: true,
    },
    plan: {
      type: [dailyWorkoutSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Workout = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);

export default Workout;

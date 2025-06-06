import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
  {
    userId: {
    type: String, // Clerk user ID
    required: true,
  },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    healthCondition: {
      type: String,
      default: "",
    },
    height: {
      type: String, 
      required: true,
    },
    weight: {
      type: String, 
      required: true,
    },
    fitnessGoal: {
      type: String, 
      required: true,
    },
    workoutDaysPerWeek: {
      type: Number, 
      required: true,
    },
    fitnessLevel: {
      type: String, // e.g., Beginner, Intermediate, Advanced
      required: true,
    },
    dietAllergy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Detail = mongoose.models.Detail || mongoose.model("Detail", detailSchema);

export default Detail;

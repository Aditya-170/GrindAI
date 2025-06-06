import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  breakfast: [String],
  lunch: [String],
  eveningSnack: [String],
  dinner: [String],
}, { _id: false });

const dailyDietSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  meals: mealSchema,
}, { _id: false });

const DietPlanSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk user ID
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  plan: {
    type: [dailyDietSchema],
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.DietPlan || mongoose.model("DietPlan", DietPlanSchema);

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/db";
import DietPlan from "@/models/dietModel";
import Workout from "@/models/workoutModel";
import Detail from "@/models/detailModel";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server"; 

export async function POST(req) {
  function extractJsonFromString(text) {
    const firstBrace = text.indexOf("{");
    let braceCount = 0;

    for (let i = firstBrace; i < text.length; i++) {
      if (text[i] === "{") braceCount++;
      else if (text[i] === "}") braceCount--;

      if (braceCount === 0) {
        const jsonString = text.slice(firstBrace, i + 1);
        return jsonString;
      }
    }

    throw new Error("Could not extract valid JSON");
  }

  try {
    // ✅ Get Clerk user ID from backend session
    const { userId } = await auth();
    console.log("Authenticated User ID:", userId);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectDB();
    const body = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `
You are a professional fitness coach. Based on the following user details, generate a structured, JSON-style weekly workout and diet plan. The format must be strictly followed so it can be parsed by code.

User Details:
- Name: ${body.name}
- Age: ${body.age}
- Gender: ${body.gender}
- Height: ${body.height} cm
- Weight: ${body.weight} kg
- Health Condition: ${body.healthCondition}
- Fitness Goal: ${body.fitnessGoal}
- Days per Week: ${body.daysPerWeek}
- Fitness Level: ${body.fitnessLevel}
- Diet Allergies: ${body.dietAllergies}

Respond ONLY in the following JSON format (no extra commentary):

{
  "workoutPlan": [
    {
      "day": "Monday",
      "exercises": ["Exercise 1", "Exercise 2"]
    },
    ...
  ],
  "dietPlan": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": ["item1", "item2"],
        "lunch": ["item1", "item2"],
        "eveningSnack": ["item1", "item2"],
        "dinner": ["item1", "item2"]
      }
    },
    ...
  ]
}
Ensure this format is followed strictly.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonString = extractJsonFromString(text);
      parsed = JSON.parse(jsonString);
    }

    const today = new Date();
    const date = format(today, "yyyy-MM-dd");

    //  Save workout plan 
    await Workout.create({
      userId,
      topic: body.fitnessGoal,
      date,
      plan: parsed.workoutPlan,
    });

    //  Save diet plan 
    await DietPlan.create({
      userId,
      topic: body.fitnessGoal,
      date,
      plan: parsed.dietPlan,
    });

     // Save user details
    await Detail.create({
      userId,
      name: body.name,
      age: body.age,
      healthCondition: body.healthCondition,
      height: body.height,
      weight: body.weight,
      fitnessGoal: body.fitnessGoal,
      workoutDaysPerWeek: body.daysPerWeek,
      fitnessLevel: body.fitnessLevel,
      dietAllergy: body.dietAllergies,
    });

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate and save plan" }), {
      status: 500,
    });
  }
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";


export default function AIAssistantPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    healthCondition: "",
    fitnessGoal: "",
    daysPerWeek: "",
    fitnessLevel: "",
    dietAllergies: "",
  });

  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [dietPlan, setDietPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setWorkoutPlan([]);
  setDietPlan([]);

  const toastId = toast.loading("Generating your personalized plan...");

  try {
    const response = await fetch("/api/generatePlan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      setWorkoutPlan(data.workoutPlan || []);
      setDietPlan(data.dietPlan || []);

      toast.update(toastId, {
        render: "Plan generated and saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      setError(data.error || "Something went wrong.");
      toast.update(toastId, {
        render: data.error || "Something went wrong.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error("Submission error:", error);
    setError("Something went wrong while generating the plan.");
    toast.update(toastId, {
      render: "Something went wrong while generating the plan.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  } finally {
    setLoading(false);
  }
};



  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          AI Fitness Assistant 🤖
        </h1>
        <p className="text-center text-zinc-400 mb-8">
          Fill out your details to generate a personalized fitness plan
        </p>

        <Card className="bg-zinc-900 p-6 space-y-4 text-white shadow-lg">
          {/* Form Fields */}
          <div>
            <label className="text-sm font-medium mb-2">Full Name</label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2">Age</label>
              <Input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Your age" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-md bg-zinc-800 text-white p-2"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2">Height (cm)</label>
              <Input type="number" name="height" value={form.height} onChange={handleChange} placeholder="Your height in cm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2">Weight (kg)</label>
              <Input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Your weight in kg" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">Health Conditions</label>
            <Textarea name="healthCondition" value={form.healthCondition} onChange={handleChange} placeholder="Any health disease" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2">Primary Fitness Goal</label>
            <select
              name="fitnessGoal"
              value={form.fitnessGoal}
              onChange={handleChange}
              className="w-full rounded-md bg-zinc-800 text-white p-2"
            >
              <option value="">Select Goal</option>
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Muscle Building</option>
              <option>Endurance</option>
              <option>General Fitness</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">Days Available Per Week</label>
            <select
              name="daysPerWeek"
              value={form.daysPerWeek} onChange={handleChange}
              className="w-full rounded-md bg-zinc-800 text-white p-2"
            >
              <option value="">Select days</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">Fitness Level</label>
            <select
              name="fitnessLevel"
              value={form.fitnessLevel}
              onChange={handleChange}
              className="w-full rounded-md bg-zinc-800 text-white p-2"
            >
              <option value="">Select Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">Any Diet Allergies?</label>
            <Textarea name="dietAllergies" value={form.dietAllergies} onChange={handleChange} placeholder="e.g. Gluten, Lactose" />
          </div>


          {/* Generate Button */}
          <div className="pt-4 w-full flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              {loading ? "Generating Plan..." : "Generate My Plan 🚀"}
            </Button>
          </div>
        </Card>

        {/* Result Display */}
        <div className="mt-10 space-y-6">
          {loading && (
            <p className="text-center text-sm text-zinc-400">Generating your personalized plan... ⏳</p>
          )}

          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          {workoutPlan.length > 0 && (
            <Card className="bg-zinc-900 p-6 text-white">
              <h2 className="text-2xl font-semibold mb-4">🏋️ Workout Plan</h2>
              {workoutPlan.map((day, i) => (
                <div key={i} className="mb-4">
                  <h3 className="font-bold">{day.day}</h3>
                  <ul className="list-disc ml-6">
                    {day.exercises.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          )}

          {dietPlan.length > 0 && (
            <Card className="bg-zinc-900 p-6 text-white">
              <h2 className="text-2xl font-semibold mb-4">🍽️ Diet Plan</h2>
              {dietPlan.map((day, i) => (
                <div key={i} className="mb-6">
                  <h3 className="font-bold">{day.day}</h3>
                  <p><strong>Breakfast:</strong> {day.meals.breakfast.join(", ")}</p>
                  <p><strong>Lunch:</strong> {day.meals.lunch.join(", ")}</p>
                  <p><strong>Evening Snack:</strong> {day.meals.eveningSnack.join(", ")}</p>
                  <p><strong>Dinner:</strong> {day.meals.dinner.join(", ")}</p>
                </div>
              ))}
            </Card>
          )}

        </div>
      </div>
    </main>
  );
}

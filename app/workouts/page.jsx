"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const createEmptyPlan = () =>
  weekdays.map((day) => ({
    day,
    exercises: [""],
  }));

export default function WorkoutsPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ topic: "customize-", plan: createEmptyPlan() });
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/workouts?userId=${user.id}`)
        .then((res) => setWorkouts(res.data))
        .catch(console.error);
    }
  }, [user]);

  const validateForm = () => {
    const errors = [];
    if (!form.topic || form.topic === "customize-") errors.push("Please enter a topic.");
    form.plan.forEach((day) => {
      if (!day.exercises.filter((e) => e.trim()).length) {
        errors.push(`At least one exercise required for ${day.day}.`);
      }
    });
    if (errors.length) {
      errors.forEach((err) => toast.error(err));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      userId: user.id,
      topic: form.topic,
      date: new Date().toISOString().slice(0, 10),
      plan: form.plan,
    };

    try {
      let res;
      if (isEditMode) {
        res = await axios.put(`/api/workouts/${editingId}`, payload);
      } else {
        res = await axios.post("/api/workouts", payload);
      }

      toast.success(res.data.message);
      const updated = await axios.get(`/api/workouts?userId=${user.id}`);
      setWorkouts(updated.data);
      setForm({ topic: "customize-", plan: createEmptyPlan() });
      setShowForm(false);
      setIsEditMode(false);
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
      console.error(err);
    }
  };

  const handleEdit = (plan) => {
    setShowForm(true);
    setIsEditMode(true);
    setEditingId(plan._id);
    setTimeout(() => {
      setForm({ topic: plan.topic, plan: plan.plan });
    }, 300); // wait for animation
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/workouts/${id}`);
      toast.success(res.data.message);
      setWorkouts(workouts.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    }
  };

  if (!user) return <div className="text-white p-6">Please sign in to view your workouts.</div>;

  return (
    <div className="bg-black min-h-screen p-4 sm:p-6 md:p-10 max-w-5xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">🏋️‍♂️ Your Workout Plans</h1>
        <Button onClick={() => setShowForm((prev) => !prev)} className="w-fit">
          {showForm ? (
            "❌"
          ) : (
            <>
              <span className="inline sm:hidden">➕</span>
              <span className="hidden sm:inline">➕ Create Plan</span>
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card
          className={`mb-6 bg-[#1f1f1f] text-white border border-gray-700 overflow-hidden transition-all duration-500 `}
        >
          <CardContent className="grid gap-4 pt-6">
            <Input
              placeholder="e.g. muscle gain, endurance"
              className="w-full bg-black text-white"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />

            {form.plan.map((day, i) => (
              <div key={i} className="border border-gray-700 p-4 rounded-md space-y-2">
                <h2 className="font-semibold">📆 {day.day}</h2>
                <Label>Exercises</Label>
                <Textarea
                  className="w-full mt-2 bg-black text-white h-24"
                  placeholder="Enter exercises separated by commas"
                  value={day.exercises.join(", ")}
                  onChange={(e) => {
                    const updated = [...form.plan];
                    updated[i].exercises = e.target.value
                      .split(",")
                      .map((ex) => ex.trim())
                      .filter((ex) => ex);
                    setForm({ ...form, plan: updated });
                  }}
                />
              </div>
            ))}

            <Button onClick={handleSubmit} className="mt-2">
              {isEditMode ? "✅ Update" : "💾 Save"} Plan
            </Button>
          </CardContent>
        </Card>
      )}

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openAccordion}
        onValueChange={(val) => setOpenAccordion(val === openAccordion ? null : val)}
      >
        {workouts.map((plan) => (
          <AccordionItem
            key={plan._id}
            value={plan._id}
            className="border border-gray-700 bg-[#1f1f1f] text-white rounded-md mb-4 px-4 py-3"
          >
            <AccordionTrigger className="flex items-center justify-between w-full">
              <div className="flex flex-col text-left">
                <p className="text-lg font-semibold">🏋️ {plan.topic}</p>
                <p className="text-sm text-gray-400">
                  {new Date(plan.createdAt).toLocaleString()}
                </p>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4">
              {plan.plan.map((day, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">📆 {day.day}</h3>
                  <p className="text-sm">🔥 {day.exercises.join(", ")}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(plan)}>
                  ✏️ Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(plan._id)}>
                  🗑 Delete
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

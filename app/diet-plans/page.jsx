"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect } from "react";
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

const createEmptyPlan = () => {
  return weekdays.map((day) => ({
    day,
    meals: {
      breakfast: [""],
      lunch: [""],
      eveningSnack: [""],
      dinner: [""],
    },
  }));
};

export default function DietPlansPage() {
  const { user } = useUser();
  const [dietPlans, setDietPlans] = useState([]);
  const [form, setForm] = useState({
    topic: "customize-",
    plan: createEmptyPlan(),
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/diet-plans?userId=${user.id}`)
        .then((res) => setDietPlans(res.data))
        .catch(console.error);
    }
  }, [user]);

  const validateForm = () => {
    const errors = [];
    if (!form.topic || form.topic === "customize-") {
      errors.push("Please enter a topic.");
    }
    form.plan.forEach((day) => {
      const isDayEmpty = Object.values(day.meals).every(
        (meal) => !meal.filter((m) => m.trim()).length
      );
      if (isDayEmpty) {
        errors.push(`At least one dish must be provided for ${day.day}.`);
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
      if (isEditMode) {
        await axios.put(`/api/diet-plans/${editingId}`, payload);
        toast.success("Plan updated successfully!");
      } else {
        await axios.post("/api/diet-plans", payload);
        toast.success("New plan created!");
      }

      const res = await axios.get(`/api/diet-plans?userId=${user.id}`);
      setDietPlans(res.data);
      setForm({ topic: "customize-", plan: createEmptyPlan() });
      setShowForm(false);
      setIsEditMode(false);
      setEditingId(null);
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleEdit = (plan) => {
    setForm({ topic: plan.topic, plan: plan.plan });
    setIsEditMode(true);
    setEditingId(plan._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/diet-plans/${id}`);
    setDietPlans(dietPlans.filter((p) => p._id !== id));
    toast.success("Plan deleted.");
  };

  return (
    <div className="bg-black min-h-screen p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📋 Your Diet Plans</h1>
        <Button onClick={() => setShowForm(!showForm)} className="w-fit">
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
        <Card className="mb-6 bg-[#1f1f1f] text-white border border-gray-700">
          <CardContent className="grid gap-4 pt-6">
            <Input
              placeholder="e.g. weight loss, muscle gain"
              className="w-full bg-black text-white"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />

            {form.plan.map((day, i) => (
              <div key={i} className="border border-gray-700 p-4 rounded-md space-y-2">
                <h2 className="font-semibold">📆 {day.day}</h2>
                {["breakfast", "lunch", "eveningSnack", "dinner"].map((meal) => (
                  <div key={meal}>
                    <Label className="capitalize">{meal}</Label>
                    <Textarea
                      className="w-full mt-2 bg-black text-white"
                      placeholder={`Enter ${meal} items separated by commas`}
                      value={day.meals[meal].join(", ")}
                      onChange={(e) => {
                        const updated = [...form.plan];
                        updated[i].meals[meal] = e.target.value
                          .split(",")
                          .map((m) => m.trim())
                          .filter((m) => m);
                        setForm({ ...form, plan: updated });
                      }}
                    />
                  </div>
                ))}
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
        value={openAccordion}
        onValueChange={(val) => setOpenAccordion(val === openAccordion ? null : val)}
      >
        {dietPlans.map((plan) => (
          <AccordionItem
            key={plan._id}
            value={plan._id}
            className="border border-gray-700 bg-[#1f1f1f] text-white rounded-md mb-4"
          >
            <AccordionTrigger className="flex justify-between items-center w-full px-4 py-2">
              <div className="text-left">
                <p className="text-lg font-semibold">{plan.topic}</p>
                <p className="text-sm text-gray-400">
                  {new Date(plan.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className={`px-4 pb-4 ${openAccordion === plan._id ? "slide-in-left" : "slide-out-left"
                }`}
            >
              {plan.plan.map((day, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">📆 {day.day}</h3>
                  {["breakfast", "lunch", "eveningSnack", "dinner"].map((meal) => (
                    <p key={meal} className="text-sm">
                      🍽 <strong>{meal}:</strong>{" "}
                      {day.meals[meal]?.join(", ") || "N/A"}
                    </p>
                  ))}
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(plan)}>
                  ✏️ Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(plan._id)}
                >
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

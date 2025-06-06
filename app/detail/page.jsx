"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const labelIcons = {
  name: "👤 Name",
  age: "🎂 Age",
  healthCondition: "🩺 Health Condition",
  height: "📏 Height",
  weight: "⚖️ Weight",
  fitnessGoal: "🎯 Goal",
  workoutDaysPerWeek: "📆 Days/Week",
  fitnessLevel: "🏋️ Level",
  dietAllergy: "🚫 Allergies",
};

const DetailPage = () => {
  const { user } = useUser();
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({
    name: "",
    age: "",
    healthCondition: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    workoutDaysPerWeek: "",
    fitnessLevel: "",
    dietAllergy: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pastDetails, setPastDetails] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/detail?userId=${user.id}`)
        .then((res) => {
          const all = res.data || [];
          if (all.length > 0) {
            setDetail(all[0]);
            setForm({ ...all[0] });
            setEditingId(all[0]._id);
            setPastDetails(all.slice(1));
          }
        })
        .catch(() => toast.error("Failed to load details"));
    }
  }, [user]);

  const handleUpdate = async () => {
    if (
      !form.name ||
      !form.age ||
      !form.height ||
      !form.weight ||
      !form.fitnessGoal ||
      !form.workoutDaysPerWeek ||
      !form.fitnessLevel
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await axios.put(`/api/detail/${editingId}`, form);
      setDetail({ ...form });
      setIsEditMode(false);
      toast.success("Details updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="bg-black min-h-screen p-4 sm:p-6 md:p-10 max-w-6xl mx-auto text-white">
      {/* Latest Fitness Detail */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧬 Your Latest Fitness Details</h1>
        {!isEditMode && (
          <Button onClick={() => setIsEditMode(true)} className="w-fit">
            ✏️ Edit
          </Button>
        )}
      </div>

      <Card className="bg-[#1f1f1f] text-white border border-gray-700 w-full">
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-8">
          {Object.entries(form)
            .filter(
              ([key]) =>
                !["_id", "userId", "__v", "createdAt", "updatedAt"].includes(key)
            )
            .map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <Label className="text-sm font-semibold mb-1 text-gray-300">
                  {labelIcons[key] || key}
                </Label>
                <Input
                  type={typeof value === "number" ? "number" : "text"}
                  className="bg-black text-white border-gray-600"
                  value={value}
                  readOnly={!isEditMode}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
        </CardContent>

        {isEditMode && (
          <div className="p-6 pt-0 flex justify-end">
            <Button onClick={handleUpdate} className="mt-2">
              ✅ Update
            </Button>
          </div>
        )}
      </Card>

      {/* Past Details Section */}
      {pastDetails.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            📜 Your Past Details
          </h2>
          <div className="grid gap-4">
            {pastDetails.map((entry) => {
              const isOpen = expandedId === entry._id;
              return (
                <Card
                  key={entry._id}
                  className={`bg-[#1f1f1f] border border-gray-700 transition-all duration-300 ease-in-out`}
                >
                  <div
                    onClick={() =>
                      setExpandedId(isOpen ? null : entry._id)
                    }
                    className="flex justify-between items-center p-4 cursor-pointer"
                  >
                    <p className="text-lg font-medium text-white">
                      👤 {entry.name} &nbsp;&nbsp;&nbsp; 📅{" "}
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>

                  {isOpen && (
                    <div className="slide-in-right">
                      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {Object.entries(entry)
                          .filter(
                            ([key]) =>
                              !["_id", "userId", "__v", "createdAt", "updatedAt"].includes(key)
                          )
                          .map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-sm font-semibold mb-1 text-white">
                                {labelIcons[key] || key}
                              </Label>
                              <div className="bg-black border border-gray-700 p-2 rounded-md text-white">
                                {value || "—"}
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </div>
                  )}

                </Card>
              );
            })}
          </div>
        </div>
      )}


    </div>
  );
};

export default DetailPage;

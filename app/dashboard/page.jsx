"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("-");
  const [goal, setGoal] = useState("-");
  const [weightHistory, setWeightHistory] = useState([]);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [dietCount, setDietCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("-");
  const [profileStatus, setProfileStatus] = useState("⚠️ Incomplete");

  useEffect(() => {
    if (!user?.id) return;

    async function fetchAll() {
      try {
        const [detailRes, workoutsRes, dietPlansRes] = await Promise.all([
          axios.get(`/api/detail?userId=${user.id}`),
          axios.get(`/api/workouts?userId=${user.id}`),
          axios.get(`/api/diet-plans?userId=${user.id}`),
        ]);

        const details = detailRes.data;
        if (details.length > 0) {
          const latest = details[0];
          setName(latest.name);
          setGoal(latest.fitnessGoal);
          setLastUpdated(new Date(latest.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }));
          setProfileStatus("✅ Completed");
        }

        const workouts = workoutsRes.data;
        setWorkoutCount(workouts.length);

        const plans = dietPlansRes.data;
        setDietCount(plans.length);

        // Pull weightHistory from detail's created timestamps and extract
        const history = details
          .map((d) => ({
            date: new Date(d.createdAt).toISOString().slice(0, 10),
            weight: parseFloat(d.weight),
          }))
          .reverse(); // oldest to latest
        setWeightHistory(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [user]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  const suggestion = (() => {
  if (weightHistory.length < 2) return "📉 Add more weight entries to see progress suggestions.";

  const initialWeight = weightHistory[0].weight;
  const latestWeight = weightHistory[weightHistory.length - 1].weight;
  const isDecreasing = latestWeight < initialWeight;
  const isIncreasing = latestWeight > initialWeight;

  switch (goal) {
    case "Weight Loss":
      return isDecreasing
        ? "✅ Great progress! You're trending toward your weight loss goal."
        : "⚠️ Your weight isn't decreasing—review your diet and exercise plan.";

    case "Weight Gain":
      return isIncreasing
        ? "🍽️ Nice! You're gaining healthy weight. Keep it up."
        : "📉 Your weight is not increasing—consider increasing calorie intake.";

    case "Muscle Gain":
      return isIncreasing
        ? "💪 Good job! You’re gaining muscle mass."
        : "📉 You may need to increase protein intake and focus on resistance training.";

    case "Endurance":
      return "🏃‍♂️ Keep going! Focus on consistent workouts, hydration, and recovery.";

    default:
      return "🎯 Stay consistent and track your progress!";
  }
})();


  const chartData = {
    labels: weightHistory.map((e) => e.date),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((e) => e.weight),
        fill: false,
        tension: 0.4,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointBackgroundColor: "#22c55e",
      },
    ],
  };

  const weeklyActivity = {
    Monday: workoutCount > 0,
    Tuesday: false,
    Wednesday: workoutCount > 1,
    Thursday: false,
    Friday: workoutCount > 2,
    Saturday: false,
    Sunday: workoutCount > 3,
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👋 Welcome back, {name}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{
            title: "🏋️ Workouts Plan Count", value: workoutCount
          },
          { title: "🥗 Diet Plans Count", value: dietCount },
          { title: "📄 Profile Status", value: profileStatus },
          { title: "🕒 Last Updated", value: lastUpdated }
        ].map((item, i) => (
          <Card
            key={i}
            className="bg-[#1f1f1f] border-gray-700 text-white p-2 border"
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{item.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8 bg-[#1f1f1f] border border-gray-700 text-white p-2">
        <CardHeader>
          <CardTitle>🎯 Goal Suggestion</CardTitle>
        </CardHeader>
        <CardContent>{suggestion}</CardContent>
      </Card>

      <Card className="mb-8 bg-[#1f1f1f] border border-gray-700 text-white p-2">
        <CardHeader>
          <CardTitle>📊 Weight Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { ticks: { color: "white" }, grid: { color: "#444" } },
                x: { ticks: { color: "white" }, grid: { color: "#444" } },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-[#1f1f1f] border border-gray-700 text-white p-2">
        <CardHeader>
          <CardTitle>📅 Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mt-2">
            {Object.entries(weeklyActivity).map(([day, done]) => (
              <div
                key={day}
                className={`rounded-md p-2 text-center border ${
                  done ? "bg-green-600 border-green-500" : "bg-gray-700 border-gray-600"
                }`}
              >
                <div className="font-semibold">{day.slice(0, 3)}</div>
                <div>{done ? "✅" : "❌"}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

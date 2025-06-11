// app/nearby-gyms/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Star, LocateFixed, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function NearbyGymsPage() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchGyms = async (lat, lon) => {
  setLoading(true);
  setError("");
  setGyms([]);

  try {
    const res = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=7000&query=gym&limit=20`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Foursquare API failed");
    }

    const data = await res.json();

    const gyms = data.results.map((place) => ({
      id: place.fsq_id,
      name: place.name || "🏋️ Unnamed Gym",
      address:
        place.location?.formatted_address ||
        `${place.location?.address}, ${place.location?.locality}`,
      lat: place.geocodes.main.latitude,
      lon: place.geocodes.main.longitude,
      rating: (Math.random() * 2 + 3).toFixed(1), // Simulated rating
    }));

    setGyms(gyms);
  } catch (err) {
    setError("⚠️ Failed to fetch gyms from Foursquare");
  } finally {
    setLoading(false);
  }
};


  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchGyms(latitude, longitude);
      },
      () => setError("Permission denied for location access")
    );
  };

  const handleSearchLocation = async () => {
    if (!location.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.length === 0) {
        setError("Location not found");
        setLoading(false);
        return;
      }
      const { lat, lon } = data[0];
      fetchGyms(parseFloat(lat), parseFloat(lon));
    } catch (err) {
      setError("Error fetching coordinates");
      setLoading(false);
    }
  };

  const sortedGyms = [...gyms].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-6 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-2">
        <Dumbbell className="w-7 h-7" /> Find Nearby Gyms 🏋️‍♂️
      </h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center">
        <Input
          placeholder="Enter a location 📍"
          className="bg-zinc-900 text-white border border-zinc-700 w-full sm:max-w-xs"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button onClick={handleSearchLocation} className="flex gap-1 items-center">
          <Search className="w-4 h-4" /> Search
        </Button>
        <Button variant="outline" onClick={handleUseCurrentLocation} className="flex bg-green-900 gap-1 items-center">
          <LocateFixed className="w-4 h-4" /> Current Location
        </Button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 px-2 py-2 rounded"
        >
          <option value="name">🔠 Sort by Name</option>
          <option value="rating">⭐ Sort by Rating</option>
        </select>
      </div>

      {loading && <p className="text-center py-10 text-white">⏳ Searching for gyms...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {gyms.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {sortedGyms.map((gym) => (
              <Card key={gym.id} className="bg-zinc-900 text-white border border-zinc-700">
                <CardContent className="p-4 flex items-start gap-4">
                  <Dumbbell className="text-white mt-1 w-5 h-5" />
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{gym.name}</p>
                    <p className="text-sm text-gray-300 italic">{gym.address}</p>
                    <p className="flex items-center gap-1 text-sm text-yellow-400">
                      <Star className="w-4 h-4" /> {gym.rating}/5
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden"
          >
            <Map gyms={sortedGyms} />
          </motion.div>
        </div>
      ) : (
        !loading && <p className="text-center py-10 text-gray-400">😓 No gyms found nearby.</p>
      )}
    </div>
  );
}

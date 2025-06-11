"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fixing default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({ gyms }) {
  const defaultPosition = gyms.length
    ? [gyms[0].lat, gyms[0].lon]
    : [28.6139, 77.209]; // Default to Delhi if no gyms

  useEffect(() => {
    // Leaflet sometimes needs a resize trigger when container is hidden initially
    setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
  }, [gyms]);

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0 rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gyms.map((gym) => (
          <Marker key={gym.id} position={[gym.lat, gym.lon]}>
            <Popup>
              <strong>{gym.name}</strong>
              <br />
              {gym.address}
              <br />
              ⭐ {gym.rating}/5
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

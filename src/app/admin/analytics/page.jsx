"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import useSWR from "swr";
import { useState } from "react";
import Loader from "@/components/Loader";

import "leaflet/dist/leaflet.css";

// Fix default icon issue in Next.js (otherwise markers won't show)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const fetcher = (url) => fetch(url).then((res) => res.json());

// Basic country coordinates (add more as needed)
const countryCoords = {
  US: { lat: 37.0902, lng: -95.7129 },
  IN: { lat: 20.5937, lng: 78.9629 },
  NP: { lat: 28.3949, lng: 84.1240 },
  // Add others...
};

export default function AnalyticsDashboard() {
  const { data, error } = useSWR("/api/admin/analytic", fetcher);

  if (error) return <p className="text-red-400">Failed to load analytics.</p>;
  if (!data) return <Loader />;

  const { realtime, pages } = data;
  const activeUsers = realtime.metricValues?.[0]?.value || 0;

  const locations = realtime.rows?.map((r) => ({
    country: r.dimensionValues[0].value,
    city: r.dimensionValues[1]?.value || "Unknown",
    users: +r.metricValues[0].value,
  })) || [];

  const topPages = pages.rows?.map((r) => ({
    path: r.dimensionValues[0].value,
    views: +r.metricValues[0].value,
  })) || [];



  return (
    <div className="p-8 space-y-10 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6">📈 Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Real-Time Active Users</h2>
          <p className="text-5xl font-semibold">{activeUsers}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Top Pages (7d)</h2>
          <ul className="space-y-2 max-h-80 overflow-auto">
            {topPages.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span className="truncate max-w-xs">{p.path}</span>
                <span>{p.views}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl mb-4">User Locations (Country / City)</h2>

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((loc, i) => {
            const coords = countryCoords[loc.country];
            if (!coords) return null;

            return (
              <Marker key={i} position={[coords.lat, coords.lng]}>
                <Popup>
                  <strong>{loc.city}, {loc.country}</strong>
                  <br />
                  Users: {loc.users}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

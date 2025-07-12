"use client";

import { useState, useEffect } from "react"; // Import useEffect
import useSWR from "swr";
import dynamic from "next/dynamic"; // Import dynamic for client-side rendering
import Loader from "@/components/Loader"; // Assuming you have a Loader component

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "leaflet/dist/leaflet.css";

// Dynamically import MapContainer and related components to disable SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Fix default icon issue in Next.js (only run on client-side)
// This block must be inside a useEffect or checked for window existence
if (typeof window !== 'undefined') {
  const L = require("leaflet"); // Require leaflet only on client-side
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.com/libraries/leaflet/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}


const fetcher = (url) => fetch(url).then((res) => res.json());

// Basic country coordinates (add more as needed for better map coverage)
// For a production app, consider using a more comprehensive geocoding service
const countryCoords = {
  US: { lat: 37.0902, lng: -95.7129 },
  IN: { lat: 20.5937, lng: 78.9629 },
  NP: { lat: 28.3949, lng: 84.1240 },
  GB: { lat: 55.3781, lng: -3.4360 }, // United Kingdom
  DE: { lat: 51.1657, lng: 10.4515 }, // Germany
  FR: { lat: 46.2276, lng: 2.2137 }, // France
  CA: { lat: 56.1304, lng: -106.3468 }, // Canada
  AU: { lat: -25.2744, lng: 133.7751 }, // Australia
  BR: { lat: -14.2350, lng: -51.9253 }, // Brazil
  JP: { lat: 36.2048, lng: 138.2529 }, // Japan
  CN: { lat: 35.8617, lng: 104.1954 }, // China
  MX: { lat: 23.6345, lng: -102.5528 }, // Mexico
  ES: { lat: 40.4637, lng: -3.7492 }, // Spain
  IT: { lat: 41.8719, lng: 12.5674 }, // Italy
  // Add more as needed
};

// Colors for Pie Charts
const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f", "#ffbb28", "#a4de6c", "#d0ed57"];


export default function AnalyticsDashboard() {
  const { data, error } = useSWR("/api/admin/analytic", fetcher);
  const [mounted, setMounted] = useState(false); // State to track if component is mounted

  useEffect(() => {
    setMounted(true); // Set mounted to true after initial render
  }, []);

  if (error) return <p className="text-red-400 p-8">Failed to load analytics. Please check your API keys and network connection.</p>;
  if (!data) return <Loader />; // Display a loader while data is being fetched

  const { realtime, pages, summary, device, source } = data;

  // Process Real-time data
  const activeUsers = realtime.metricValues?.[0]?.value || 0;
  const locations = realtime.rows?.map((r) => ({
    country: r.dimensionValues[0].value,
    city: r.dimensionValues[1]?.value || "Unknown",
    users: +r.metricValues[0].value,
  })) || [];

  // Process Top Pages data
  const topPages = pages.rows?.map((r) => ({
    path: r.dimensionValues[0].value,
    views: +r.metricValues[0].value,
  })) || [];

  // Process Overall Summary data
  const newUsers = summary.rows?.[0]?.metricValues?.[0]?.value || 0;
  const bounceRate = (parseFloat(summary.rows?.[0]?.metricValues?.[1]?.value || 0) * 100).toFixed(2);
  const averageSessionDuration = parseFloat(summary.rows?.[0]?.metricValues?.[2]?.value || 0).toFixed(2);

  // Process Device Usage data
  const deviceData = device.rows?.map((r) => ({
    device: r.dimensionValues[0].value,
    users: +r.metricValues[0].value,
  })) || [];

  // Process Traffic Source data
  const sourceData = source.rows?.map((r) => ({
    source: r.dimensionValues[0].value,
    users: +r.metricValues[0].value,
  })) || [];

  return (
    <div className="p-4 sm:p-8 space-y-8 sm:space-y-10 bg-gray-900 min-h-screen text-gray-100 font-inter">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center sm:text-left">📈 Admin Analytics Dashboard</h1>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">Real-Time Active Users</h2>
          <p className="text-4xl sm:text-5xl font-semibold text-purple-400">{activeUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">New Users (7d)</h2>
          <p className="text-4xl sm:text-5xl font-semibold text-green-400">{newUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">Bounce Rate (7d)</h2>
          <p className="text-4xl sm:text-5xl font-semibold text-red-400">{bounceRate}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">Avg. Session Duration (7d)</h2>
          <p className="text-4xl sm:text-5xl font-semibold text-blue-400">{averageSessionDuration}s</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Top Pages Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">Top Pages (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topPages}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="path" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
                contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e5e7eb" }}
                labelStyle={{ color: "#9ca3af" }}
                formatter={(value) => [`${value} Views`, "Page Views"]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="views" fill="#8884d8" name="Page Views" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NEW: Top Pages List */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">Top Pages List (Last 7 Days)</h2>
          <ul className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {topPages.length > 0 ? (
              topPages.map((p, i) => (
                <li key={i} className="flex justify-between items-center text-gray-300 border-b border-gray-700 pb-2 last:border-b-0">
                  <span className="flex-1 truncate pr-2 text-sm sm:text-base">{p.path}</span>
                  <span className="font-medium text-purple-300 text-sm sm:text-base">{p.views} views</span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400 py-4">No top pages data available.</li>
            )}
          </ul>
        </div>

        {/* Device Usage Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">Device Usage (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="users"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ device, percent }) => `${device} (${(percent * 100).toFixed(0)}%)`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e5e7eb" }}
                labelStyle={{ color: "#9ca3af" }}
                formatter={(value, name, props) => [`${value} Users`, props.payload.device]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">Traffic Sources (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sourceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="source" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
                contentStyle={{ backgroundColor: "#374151", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#e5e7eb" }}
                labelStyle={{ color: "#9ca3af" }}
                formatter={(value) => [`${value} Users`, "Source Users"]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="users" fill="#82ca9d" name="Source Users" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Locations Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">User Locations (Real-time)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Map Container */}
          <div>
            {/* Render MapContainer only if mounted is true */}
            {mounted && (
              <MapContainer
                center={[20, 0]} // Center of the world
                zoom={2}
                style={{ height: "400px", width: "100%", borderRadius: "8px", border: "1px solid #4a5568" }}
                scrollWheelZoom={false}
                className="z-0" // Ensure map is behind other elements if any overlap
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc, i) => {
                  const coords = countryCoords[loc.country];
                  if (!coords) {
                    // console.warn(`Coordinates not found for country: ${loc.country}`);
                    return null; // Skip if coordinates are not available
                  }

                  return (
                    <Marker key={i} position={[coords.lat, coords.lng]}>
                      <Popup>
                        <strong className="text-gray-900">{loc.city}, {loc.country}</strong>
                        <br />
                        <span className="text-gray-800">Active Users: {loc.users}</span>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>

          {/* Locations Table */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full bg-gray-700 rounded-lg shadow-inner">
              <thead className="sticky top-0 bg-gray-600">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-200 font-semibold rounded-tl-lg">Country</th>
                  <th className="py-2 px-4 text-left text-gray-200 font-semibold">City</th>
                  <th className="py-2 px-4 text-left text-gray-200 font-semibold rounded-tr-lg">Users</th>
                </tr>
              </thead>
              <tbody>
                {locations.length > 0 ? (
                  locations.map((loc, i) => (
                    <tr key={i} className="border-b border-gray-600 last:border-b-0 hover:bg-gray-600 transition-colors">
                      <td className="py-2 px-4 text-sm sm:text-base">{loc.country}</td>
                      <td className="py-2 px-4 text-sm sm:text-base">{loc.city}</td>
                      <td className="py-2 px-4 text-sm sm:text-base">{loc.users}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-400">No real-time user locations available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151; /* bg-gray-700 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563; /* bg-gray-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; /* bg-gray-500 */
        }
      `}</style>
    </div>
  );
}

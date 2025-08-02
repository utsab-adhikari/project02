"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";
import { FiRefreshCw, FiUser, FiClock, FiBarChart2, FiMapPin } from "react-icons/fi";
import Loader from "@/components/Loader";

// Dynamic imports with loading states
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="bg-gray-700 rounded-lg h-[400px] flex items-center justify-center">Loading map...</div>
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
);
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster").then(mod => mod.default),
  { ssr: false }
);

// Fix leaflet icon issue
if (typeof window !== 'undefined') {
  const L = require("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.com/libraries/leaflet/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

const fetcher = (url) => fetch(url).then(res => res.json());

// Expanded country coordinates
const countryCoords = {
  US: { lat: 37.0902, lng: -95.7129 },
  IN: { lat: 20.5937, lng: 78.9629 },
  NP: { lat: 28.3949, lng: 84.1240 },
  GB: { lat: 55.3781, lng: -3.4360 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  CA: { lat: 56.1304, lng: -106.3468 },
  AU: { lat: -25.2744, lng: 133.7751 },
  BR: { lat: -14.2350, lng: -51.9253 },
  JP: { lat: 36.2048, lng: 138.2529 },
  CN: { lat: 35.8617, lng: 104.1954 },
  MX: { lat: 23.6345, lng: -102.5528 },
  ES: { lat: 40.4637, lng: -3.7492 },
  IT: { lat: 41.8719, lng: 12.5674 },
  RU: { lat: 61.5240, lng: 105.3188 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  NG: { lat: 9.0820, lng: 8.6753 },
  EG: { lat: 26.8206, lng: 30.8025 },
  KR: { lat: 35.9078, lng: 127.7669 },
  SG: { lat: 1.3521, lng: 103.8198 },
  // Add more countries as needed
};

// Color schemes
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f", "#ffbb28"];
const TRAFFIC_COLORS = ["#4f46e5", "#ec4899", "#0ea5e9", "#10b981", "#f59e0b"];

export default function AnalyticsDashboard() {
  const { data, error, mutate, isValidating } = useSWR("/api/admin/analytic", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 300000 // 5 minutes
  });
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (data) setLastUpdated(Date.now());
  }, [data]);

  const refreshData = () => {
    mutate();
    setLastUpdated(Date.now());
  };

  // Process data with memoization
  const {
    activeUsers,
    locations,
    topPages,
    newUsers,
    bounceRate,
    avgSession,
    deviceData,
    sourceData,
    locationStats
  } = useMemo(() => {
    if (!data) return {};
    
    const realtime = data.realtime || {};
    const pages = data.pages || {};
    const summary = data.summary || {};
    const device = data.device || {};
    const source = data.source || {};
    
    return {
      activeUsers: realtime.metricValues?.[0]?.value || 0,
      locations: (realtime.rows || []).map(r => ({
        country: r.dimensionValues[0]?.value || "Unknown",
        city: r.dimensionValues[1]?.value || "Unknown",
        users: +r.metricValues[0]?.value || 0
      })),
      topPages: (pages.rows || [])
        .slice(0, 10)
        .map(r => ({
          path: r.dimensionValues[0]?.value || "/",
          views: +r.metricValues[0]?.value || 0
        })),
      newUsers: summary.rows?.[0]?.metricValues?.[0]?.value || 0,
      bounceRate: (parseFloat(summary.rows?.[0]?.metricValues?.[1]?.value || 0) * 100).toFixed(2),
      avgSession: parseFloat(summary.rows?.[0]?.metricValues?.[2]?.value || 0).toFixed(2),
      deviceData: (device.rows || []).map(r => ({
        device: r.dimensionValues[0]?.value || "Unknown",
        users: +r.metricValues[0]?.value || 0
      })),
      sourceData: (source.rows || []).map(r => ({
        source: r.dimensionValues[0]?.value || "Unknown",
        users: +r.metricValues[0]?.value || 0
      })),
      locationStats: (realtime.rows || [])
        .reduce((acc, loc) => {
          const country = loc.dimensionValues[0]?.value || "Unknown";
          acc[country] = (acc[country] || 0) + (+loc.metricValues[0]?.value || 0);
          return acc;
        }, {})
    };
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md bg-gray-800 rounded-xl p-8 text-center shadow-xl">
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Data Load Failed</h2>
          <p className="text-gray-300 mb-6">
            Failed to load analytics data. Please check your network connection and API configuration.
          </p>
          <button
            onClick={refreshData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center mx-auto transition-all"
          >
            <FiRefreshCw className="mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <Loader />;

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen text-gray-100 font-inter">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <FiBarChart2 className="text-indigo-400" />
            <span>Admin Analytics Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            {isValidating && <span className="ml-2 text-indigo-400">Updating...</span>}
          </p>
        </div>
        
        <motion.button
          onClick={refreshData}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiRefreshCw className={isValidating ? "animate-spin" : ""} />
          Refresh Data
        </motion.button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Real-Time Users" 
          value={activeUsers} 
          icon={<FiUser />} 
          color="text-purple-400" 
          trend="up"
        />
        <MetricCard 
          title="New Users (7d)" 
          value={newUsers} 
          icon={<FiUser />} 
          color="text-green-400" 
          trend="up"
        />
        <MetricCard 
          title="Bounce Rate (7d)" 
          value={`${bounceRate}%`} 
          icon={<FiClock />} 
          color="text-red-400" 
          trend="down"
        />
        <MetricCard 
          title="Avg. Session" 
          value={`${avgSession}s`} 
          icon={<FiClock />} 
          color="text-blue-400" 
          trend="up"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Chart */}
        <ChartCard title="Top Pages (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPages} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="path" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => value.length > 30 ? `${value.substring(0, 27)}...` : value}
              />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
                formatter={(value) => [`${value} Views`, 'Page Views']}
                labelStyle={{ color: '#d1d5db', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="views" 
                name="Page Views"
                radius={[4, 4, 0, 0]}
              >
                {topPages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Usage Chart */}
        <ChartCard title="Device Usage (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="users"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
                formatter={(value, name, props) => [`${value} Users`, props.payload.device]}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Traffic Sources Chart */}
        <ChartCard title="Traffic Sources (Last 7 Days)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={sourceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="source" 
                tick={{ fill: '#9ca3af' }}
                height={50}
              />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
                formatter={(value) => [`${value} Users`, 'Active Users']}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                fill="url(#colorUsers)" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Active Users"
              />
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* User Locations Section */}
      <ChartCard 
        title={(
          <div className="flex items-center gap-2">
            <FiMapPin className="text-rose-400" />
            <span>User Locations (Real-time)</span>
          </div>
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Visualization */}
          <div className="h-[400px] rounded-lg overflow-hidden border border-gray-700">
            {mounted && (
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                  {locations.map((loc, i) => {
                    const coords = countryCoords[loc.country] || { lat: 20, lng: 0 };
                    return (
                      <Marker key={i} position={[coords.lat, coords.lng]}>
                        <Popup>
                          <div className="text-gray-800">
                            <div className="font-bold">{loc.city}, {loc.country}</div>
                            <div className="mt-1">{loc.users} active users</div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </MapContainer>
            )}
          </div>

          {/* Location Data */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-300">Country Distribution</h3>
              <span className="text-sm text-gray-500">{locations.length} locations</span>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar max-h-[300px]">
              {Object.entries(locationStats).map(([country, users], idx) => (
                <div key={country} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{country}</span>
                    <span className="text-gray-400">{users} users</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (users / activeUsers) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gray-700 ${color}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`mt-4 text-xs flex items-center ${
        trend === "up" ? "text-green-400" : "text-red-400"
      }`}>
        {trend === "up" ? "↑ 5.2%" : "↓ 2.3%"} from last week
      </div>
    )}
  </motion.div>
);

// Reusable Chart Card Component
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg ${className}`}>
    <h2 className="text-lg font-bold text-gray-200 mb-4">{title}</h2>
    {children}
  </div>
);
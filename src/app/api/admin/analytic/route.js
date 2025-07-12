// src/app/api/admin/analytic/route.js
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

const analytics = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

export async function GET() {
  try {
    const prop = `properties/${process.env.GA_PROPERTY_ID}`;

    // Real-time active users
    const [rt] = await analytics.runRealtimeReport({
      property: prop,
      metrics: [{ name: "activeUsers" }],
      dimensions: [{ name: "country" }, { name: "city" }],
    });

    // Page views last 7 days
    const [pv] = await analytics.runReport({
      property: prop,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "screenPageViews" }],
      dimensions: [{ name: "pagePath" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    return NextResponse.json({ realtime: rt, pages: pv });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

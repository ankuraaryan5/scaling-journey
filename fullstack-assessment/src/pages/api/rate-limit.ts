import type { NextApiRequest, NextApiResponse } from "next";

// In-memory store for IP request counts
const ipRequestCounts: Map<string, { count: number; lastRequestTime: number }> = new Map();

// Rate limit configuration
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!ip) {
    return res.status(400).json({ message: "Unable to identify IP" });
  }

  const now = Date.now();
  const record = ipRequestCounts.get(ip as string);

  if (record) {
    // Check if the window has expired
    if (now - record.lastRequestTime > WINDOW_MS) {
      // Reset counter
      ipRequestCounts.set(ip as string, { count: 1, lastRequestTime: now });
    } else {
      // Increment counter
      if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({ message: "Too Many Requests" });
      }
      record.count += 1;
      ipRequestCounts.set(ip as string, record);
    }
  } else {
    // First request from this IP
    ipRequestCounts.set(ip as string, { count: 1, lastRequestTime: now });
  }

  // Normal response
  res.status(200).json({ message: "Request successful!" });
}

"use client"
import { useState } from "react";

export default function RateTest() {
  const [status, setStatus] = useState<string>("");
  const [requests, setRequests] = useState<number>(0);

  const makeRequest = async () => {
    setRequests(prev => prev + 1);
    try {
      const res = await fetch("/api/rate-limit");
      const data = await res.json();

      if (res.status === 429) {
        setStatus("429 Too Many Requests");
      } else {
        setStatus(data.message);
      }
    } catch (err) {
      setStatus("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">API Rate Limiter Test</h1>

      <button
        onClick={makeRequest}
        className="mb-4 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Make Request
      </button>

      <div className="text-lg text-blue-400">
        Requests Made: <span className="font-semibold">{requests}</span>
      </div>

      <div
        className={`mt-4 px-4 py-2 rounded font-semibold ${
          status === "Too Many Requests"
            ? "bg-red-200 text-red-800"
            : "bg-green-200 text-green-800"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

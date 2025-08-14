"use client";

import { useState } from "react";
import { toRoman } from "@/lib/roman";

export default function RomanPage() {
  const [value, setValue] = useState<string>("5");
  const [result, setResult] = useState<string>("V");
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    setError("");
    try {
      const num = Number(value);
      const roman = toRoman(num);
      setResult(roman);
    } catch (e: any) {
      setResult("");
      setError(e?.message ?? "Conversion error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl shadow p-6 bg-white space-y-4">
        <h1 className="text-2xl font-semibold">Roman Numeral Converter (1–100)</h1>

        <label className="block">
          <span className="text-sm text-gray-600">Enter an integer (1–100)</span>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring text-gray-900"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            placeholder="e.g., 5"
          />
        </label>

        <button
          onClick={handleConvert}
          className="rounded-xl px-4 py-2 bg-black text-white"
        >
          Convert
        </button>

        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : (
          <p className="text-lg text-green-600">
            Result: <span className="font-mono">{result || "—"}</span>
          </p>
        )}

        <div className="text-sm text-gray-500">
          <p><strong>Examples:</strong> 4 → IV, 9 → IX, 40 → XL, 90 → XC, 100 → C</p>
        </div>
      </div>
    </main>
  );
}

// src/lib/roman.ts
export function toRoman(num: number): string {
  // Validate input
  if (typeof num !== "number" || Number.isNaN(num)) {
    throw new TypeError("Input must be a valid number.");
  }
  if (!Number.isInteger(num)) {
    throw new RangeError("Input must be an integer.");
  }
  if (num < 1 || num > 100) {
    throw new RangeError("Input must be between 1 and 100 (inclusive).");
  }

  // Special case for 100
  if (num === 100) return "C";

  const numerals: Array<[number, string]> = [
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  let remaining = num;

  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

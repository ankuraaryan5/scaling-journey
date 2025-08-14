"use client";

import { useEffect } from "react";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000); // Auto dismiss
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded shadow-md flex justify-between items-center mb-2 animate-slideIn`}
    >
      <span>{message}</span>
      <button onClick={() => onClose(id)} className="ml-4 font-bold">
        ✕
      </button>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ToastProvider";
import ThemeProvider from "./ThemeProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <SessionProvider><ThemeProvider><ToastProvider>{children}</ToastProvider></ThemeProvider></SessionProvider>;
}

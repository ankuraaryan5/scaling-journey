"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ToastProvider";


export default function ClientProviders({ children }: { children: ReactNode }) {
  return <SessionProvider><ToastProvider>{children}</ToastProvider></SessionProvider>;
}

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            // If not logged in, redirect to sign-in
            signIn();
            return;
        }

        // TypeScript-safe: assert session.user exists
        const user = session.user as { name?: string | null; role?: string };

        // Redirect if role is not allowed
        if (!["user", "admin"].includes(user.role!)) {
            router.push("/unauthorized");
        }
    }, [session, status, router]);

    if (status === "loading" || !session) return <div>Loading...</div>;

    // TypeScript-safe access to user
    const user = session.user!;

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };
    return (
        <div>
            Welcome {user.name}! This is your dashboard.
            <button onClick={handleSignOut} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                Sign Out
            </button>

        </div>
    );
}

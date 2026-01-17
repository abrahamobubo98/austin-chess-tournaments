"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Crown, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const { user, loading, isAdmin, login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Redirect if already logged in as admin
    useEffect(() => {
        if (!loading && user && isAdmin) {
            router.push("/admin");
        }
    }, [loading, user, isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            // Login successful, do a hard redirect to ensure fresh auth state
            window.location.href = "/admin";
        } catch (err: any) {
            console.error("Login error:", err);
            const errorMessage = err?.message || err?.toString() || "Unknown error";
            if (errorMessage.includes("Invalid credentials") || errorMessage.includes("user_invalid_credentials") || errorMessage.includes("Invalid email")) {
                setError("Invalid email or password");
            } else if (errorMessage.includes("Rate limit")) {
                setError("Too many attempts. Please try again later.");
            } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                setError("Network error. Check if Appwrite is configured correctly.");
            } else if (errorMessage.includes("Admin privileges")) {
                setError("Access denied. Admin privileges required.");
            } else {
                setError(`Login failed: ${errorMessage}`);
            }
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
                        <Crown className="h-8 w-8 text-brand" />
                    </Link>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Sign in to manage Austin Chess Tournaments
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={submitting}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

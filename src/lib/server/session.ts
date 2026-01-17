"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE = "appwrite-session";

export async function setSessionCookie(secret: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
}

export async function getSessionCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE);
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

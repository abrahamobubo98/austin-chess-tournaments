import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear all auth cookies
        const response = NextResponse.json({ success: true });
        response.cookies.delete('appwrite-session');
        response.cookies.delete('appwrite-user-id');
        response.cookies.delete('appwrite-auth');

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);

        const response = NextResponse.json({ success: true });
        response.cookies.delete('appwrite-session');
        response.cookies.delete('appwrite-user-id');
        response.cookies.delete('appwrite-auth');

        return response;
    }
}

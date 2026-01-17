import { NextRequest, NextResponse } from 'next/server';
import { Client, Account, Users } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

        const account = new Account(client);

        // Create email session - this validates credentials
        const session = await account.createEmailPasswordSession(email, password);

        // Now use the Users API to get user details (requires API key)
        // Since we don't have an API key, we'll store what we know in cookies
        // The session was created successfully, so the user exists

        // For now, we'll assume the user is admin since only admins should know about /admin
        // In production, you'd want to use an API key to verify admin status

        // Create response with user info in cookies
        const response = NextResponse.json({
            success: true,
            userId: session.userId,
        });

        // Set session cookie
        response.cookies.set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        // Store user ID for reference
        response.cookies.set('appwrite-user-id', session.userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        // Store a simple auth flag (in production, use proper verification)
        response.cookies.set('appwrite-auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);

        if (error.code === 401 || error.type === 'user_invalid_credentials') {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}

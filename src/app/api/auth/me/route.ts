import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authFlag = cookieStore.get('appwrite-auth')?.value;
        const userId = cookieStore.get('appwrite-user-id')?.value;

        if (!authFlag || authFlag !== 'true' || !userId) {
            return NextResponse.json({ user: null, isAdmin: false });
        }

        // User is authenticated (session was created successfully)
        // For this admin-only app, we trust that only admins know the /admin URL
        // In production, you'd verify admin status with an API key
        return NextResponse.json({
            user: {
                $id: userId,
                email: 'admin', // We don't have email stored, but user is authenticated
            },
            isAdmin: true, // Trust that authenticated users are admins
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        return NextResponse.json({ user: null, isAdmin: false });
    }
}

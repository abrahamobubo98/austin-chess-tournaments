import { NextRequest, NextResponse } from "next/server";

const USCF_API_BASE = "https://ratings-api.uschess.org/api/v1";

export interface USCFRating {
    rating?: number;
    ratingSystem: string;
    gamesPlayed: number;
    isProvisional: boolean;
}

export interface USCFMemberSearchResult {
    id: string;
    firstName: string;
    lastName: string;
    stateRep?: string;
    status?: string;
    expirationDate?: string;
    ratings?: USCFRating[];
    title?: string;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const memberId = searchParams.get("memberId");

    // Require at least one parameter
    if (!query && !memberId) {
        return NextResponse.json(
            { error: "Missing query or memberId parameter" },
            { status: 400 }
        );
    }

    // Require minimum 2 characters for fuzzy search
    if (query && query.length < 2) {
        return NextResponse.json(
            { error: "Query must be at least 2 characters" },
            { status: 400 }
        );
    }

    try {
        const url = memberId
            ? `${USCF_API_BASE}/members/${encodeURIComponent(memberId)}`
            : `${USCF_API_BASE}/members?Fuzzy=${encodeURIComponent(query || "")}`;

        const response = await fetch(url, {
            headers: { Accept: "application/json" },
            // Cache for 5 minutes to reduce API load
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "Member not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: "USCF API error" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[USCF API Proxy] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch from USCF API" },
            { status: 500 }
        );
    }
}

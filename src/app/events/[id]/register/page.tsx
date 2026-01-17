import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Client, Databases, Query } from "node-appwrite";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import type { UpcomingEvent, TournamentSection } from "@/lib/database";

async function getEventAndSections(id: string): Promise<{
    event: UpcomingEvent | null;
    sections: TournamentSection[];
}> {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const databases = new Databases(client);

    // Fetch event first
    let event: UpcomingEvent | null = null;
    try {
        const eventDoc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            "upcoming_events",
            id
        );
        event = eventDoc as unknown as UpcomingEvent;
    } catch {
        return { event: null, sections: [] };
    }

    // Fetch sections separately (may fail if collection doesn't exist yet)
    let sections: TournamentSection[] = [];
    try {
        const sectionsRes = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            "tournament_sections",
            [
                Query.equal("eventId", id),
                Query.orderAsc("sortOrder"),
                Query.limit(20),
            ]
        );
        sections = sectionsRes.documents as unknown as TournamentSection[];
    } catch {
        // Sections collection may not exist yet - that's okay
        console.log("[Register] tournament_sections collection not found, proceeding without sections");
    }

    return { event, sections };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const { event } = await getEventAndSections(id);

    if (!event) {
        return { title: "Tournament Not Found" };
    }

    return {
        title: `Register for ${event.title} | Austin Chess Tournaments`,
        description: `Register for ${event.title}. ${event.description?.substring(0, 100)}...`,
    };
}

export default async function RegisterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { event, sections } = await getEventAndSections(id);

    if (!event) {
        notFound();
    }

    // Check if registration is closed
    const registrationClosed = event.registrationOpen === false;
    const eventDate = new Date(event.eventDate);
    const isPast = eventDate < new Date();

    if (isPast || registrationClosed) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-background py-12">
                    <div className="container mx-auto px-4 max-w-2xl">
                        <Link href={`/events/${id}`}>
                            <Button variant="ghost" className="mb-6">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Event
                            </Button>
                        </Link>

                        <div className="text-center py-12">
                            <h1 className="text-2xl font-bold mb-4">
                                Registration {isPast ? "Closed" : "Not Available"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isPast
                                    ? "This tournament has already taken place."
                                    : "Registration is currently closed for this tournament."}
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <Link href={`/events/${id}`}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Event
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            Register for Tournament
                        </h1>
                        <p className="text-lg text-muted-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formattedDate} • {event.location || "Location TBA"}
                        </p>
                    </div>

                    {/* Registration Wizard */}
                    <RegistrationWizard event={event} sections={sections} />
                </div>
            </main>
            <Footer />
        </>
    );
}

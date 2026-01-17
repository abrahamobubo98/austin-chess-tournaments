import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Client, Databases } from 'node-appwrite';
import { Calendar, MapPin, Clock, DollarSign, ArrowLeft, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

interface Event {
    $id: string;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    entryFee: string;
    timeControl: string;
    isActive: boolean;
}

async function getEvent(id: string): Promise<Event | null> {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

        const databases = new Databases(client);
        const doc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            'upcoming_events',
            id
        );

        return doc as unknown as Event;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return { title: 'Event Not Found' };
    }

    return {
        title: `${event.title} | Austin Chess Tournaments`,
        description: event.description.substring(0, 160),
    };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    // Split description into paragraphs
    const paragraphs = event.description.split('\n\n');

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="bg-gradient-to-b from-brand/10 to-background py-12">
                    <div className="container mx-auto px-4">
                        <Link href="/#events">
                            <Button variant="ghost" className="mb-6">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Events
                            </Button>
                        </Link>

                        <div className="flex items-start gap-4 mb-6">
                            <Badge className="bg-brand text-brand-foreground">
                                Upcoming Event
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            {event.title}
                        </h1>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <Link href={`/events/${event.$id}/register`}>
                                <Button className="bg-brand hover:bg-brand/90 text-brand-foreground">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Register Now
                                </Button>
                            </Link>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    View on Map
                                </Button>
                            </a>
                            <Link href="/#contact">
                                <Button variant="outline">
                                    Contact for More Info
                                </Button>
                            </Link>
                        </div>

                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            <Card className="bg-card/50 backdrop-blur">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <Calendar className="h-5 w-5 text-brand" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date & Time</p>
                                        <p className="font-medium">{formattedDate}</p>
                                        <p className="text-sm text-muted-foreground">{formattedTime}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <MapPin className="h-5 w-5 text-brand" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-medium">{event.location || "TBA"}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <DollarSign className="h-5 w-5 text-brand" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                                        <p className="font-medium">{event.entryFee || "TBA"}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/50 backdrop-blur">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <Clock className="h-5 w-5 text-brand" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Time Control</p>
                                        <p className="font-medium">{event.timeControl || "TBA"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="container mx-auto px-4 py-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-brand" />
                                Event Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index} className="mb-4 whitespace-pre-line">
                                    {paragraph}
                                </p>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}

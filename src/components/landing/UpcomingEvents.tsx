"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { getUpcomingEvents, type UpcomingEvent } from "@/lib/database";

export function UpcomingEvents() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getUpcomingEvents(true);
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <section id="events" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Upcoming Events
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Register for USCF-rated tournaments and special events. All skill
                        levels welcome!
                    </p>
                </div>

                {/* Events grid */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 bg-muted rounded w-full mb-2" />
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                        <p className="text-muted-foreground">
                            Check back soon for new tournaments and events!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link key={event.$id} href={`/events/${event.$id}`}>
                                <Card className="group hover:shadow-lg hover:border-brand/50 transition-all h-full cursor-pointer flex flex-col">
                                    <CardHeader className="pb-3">
                                        {/* Title - fixed height for 2 lines */}
                                        <div className="h-14 mb-2">
                                            <CardTitle className="text-lg group-hover:text-brand transition-colors line-clamp-2">{event.title}</CardTitle>
                                        </div>
                                        {/* Badge - fixed height */}
                                        <div className="h-6">
                                            {event.timeControl && (
                                                <Badge variant="secondary" className="w-fit">
                                                    {event.timeControl}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-1 pt-0">
                                        {/* Description - fixed height for 3 lines */}
                                        <div className="h-[4.5rem] mb-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {event.description || "No description available."}
                                            </p>
                                        </div>

                                        {/* Event details - always shown, no flex-1 */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4 text-brand shrink-0" />
                                                <span>{formatDate(event.eventDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4 text-brand shrink-0" />
                                                <span>{formatTime(event.eventDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4 text-brand shrink-0" />
                                                <span className="line-clamp-1">{event.location || "TBA"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <DollarSign className="h-4 w-4 text-brand shrink-0" />
                                                <span>{event.entryFee || "TBA"}</span>
                                            </div>
                                        </div>

                                        {/* View Details - always at bottom */}
                                        <div className="pt-4 mt-auto">
                                            <Button variant="ghost" size="sm" className="w-full group-hover:bg-brand/10">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

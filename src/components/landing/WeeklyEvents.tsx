"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, CalendarDays } from "lucide-react";
import { getWeeklyEvents, type WeeklyEvent } from "@/lib/database";

const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export function WeeklyEvents() {
    const [events, setEvents] = useState<WeeklyEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getWeeklyEvents(true);
                // Sort by day of week
                const sorted = [...data].sort((a, b) => {
                    return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
                });
                setEvents(sorted);
            } catch (error) {
                console.error("Failed to load weekly events:", error);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    return (
        <section id="weekly" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Weekly Schedule
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join us for regular weekly events. No registration required for most
                        sessions!
                    </p>
                </div>

                {/* Events list */}
                {loading ? (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Weekly Events</h3>
                        <p className="text-muted-foreground">
                            Check back soon for our regular schedule!
                        </p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {events.map((event) => (
                            <Card
                                key={event.$id}
                                className="group hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Day badge */}
                                        <div className="flex-shrink-0 w-24">
                                            <div className="bg-brand/10 text-brand font-semibold text-sm px-3 py-1.5 rounded-md text-center">
                                                {event.dayOfWeek}
                                            </div>
                                        </div>

                                        {/* Event info */}
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg mb-1">
                                                {event.title}
                                            </h3>
                                            {event.description && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {event.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4 text-brand" />
                                                    <span>{event.time}</span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-4 w-4 text-brand" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

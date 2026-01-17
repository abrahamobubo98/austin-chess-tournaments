import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="section-gradient relative py-20 md:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
                        <Trophy className="h-4 w-4" />
                        USCF Rated Tournaments
                    </div>

                    {/* Main heading */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Austin Chess{" "}
                        <span className="text-brand">Tournaments</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join the premier chess community in Austin. Compete in USCF-rated
                        tournaments, improve your game at weekly events, and connect with
                        players of all skill levels.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="#events">
                            <Button
                                size="lg"
                                className="bg-brand hover:bg-brand/90 text-brand-foreground w-full sm:w-auto"
                            >
                                <Calendar className="mr-2 h-5 w-5" />
                                View Upcoming Events
                            </Button>
                        </Link>
                        <Link href="#contact">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                <MapPin className="mr-2 h-5 w-5" />
                                Find Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

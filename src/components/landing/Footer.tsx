import { Crown } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Crown className="h-6 w-6 text-brand" />
                            <span className="font-bold">Austin Chess Tournaments</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your home for competitive chess in Austin. Join our community of
                            passionate players.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#events"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Upcoming Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#weekly"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Weekly Schedule
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#resources"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#faq"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* External Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Chess Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://www.uschess.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    US Chess Federation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.chess.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Chess.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://lichess.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Lichess
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Austin Chess Tournaments. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

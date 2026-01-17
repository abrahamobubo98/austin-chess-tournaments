import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FAQs() {

    return (
        <section id="faq" className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Find answers to common questions about our events, membership, and
                        policies.
                    </p>
                </div>

                {/* View All FAQs Button */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center">
                        <Link href="/faq">
                            <Button variant="outline" size="lg" className="gap-2">
                                View All FAQs
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

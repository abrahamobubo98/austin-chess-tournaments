"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookOpen, FileText, Video, Link2 } from "lucide-react";
import { getResources, type Resource } from "@/lib/database";

const categoryIcons: Record<string, React.ReactNode> = {
    rules: <FileText className="h-5 w-5" />,
    tutorials: <Video className="h-5 w-5" />,
    books: <BookOpen className="h-5 w-5" />,
    default: <Link2 className="h-5 w-5" />,
};

export function Resources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResources() {
            try {
                const data = await getResources();
                setResources(data);
            } catch (error) {
                console.error("Failed to load resources:", error);
            } finally {
                setLoading(false);
            }
        }
        loadResources();
    }, []);

    // Group resources by category
    const groupedResources = resources.reduce(
        (acc, resource) => {
            const category = resource.category || "General";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(resource);
            return acc;
        },
        {} as Record<string, Resource[]>
    );

    return (
        <section id="resources" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Resources</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Helpful links to improve your game, learn the rules, and stay
                        connected.
                    </p>
                </div>

                {/* Resources grid */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-5 bg-muted rounded w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 bg-muted rounded w-full mb-2" />
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : resources.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Resources Yet</h3>
                        <p className="text-muted-foreground">
                            Check back soon for helpful links and materials!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(groupedResources).map(([category, items]) => (
                            <Card key={category}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <span className="text-brand">
                                            {categoryIcons[category.toLowerCase()] ||
                                                categoryIcons.default}
                                        </span>
                                        {category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {items.map((resource) => (
                                            <li key={resource.$id}>
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-start gap-2 text-sm hover:text-brand transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                                                    <div>
                                                        <span className="font-medium">{resource.title}</span>
                                                        {resource.description && (
                                                            <p className="text-muted-foreground text-xs mt-0.5">
                                                                {resource.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

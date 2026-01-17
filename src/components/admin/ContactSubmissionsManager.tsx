"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, MailOpen, Eye } from "lucide-react";
import {
    getContactSubmissions,
    markContactAsRead,
    deleteContactSubmission,
    type ContactSubmission,
} from "@/lib/database";

export function ContactSubmissionsManager() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const data = await getContactSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to load contact submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markContactAsRead(id);
            await loadSubmissions();
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;

        try {
            await deleteContactSubmission(id);
            await loadSubmissions();
        } catch (error) {
            console.error("Failed to delete submission:", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const unreadCount = submissions.filter((s) => !s.isRead).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Contact Submissions</h2>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount > 0
                            ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                            : "All messages read"}
                    </p>
                </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {submissions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No contact submissions yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    submissions.map((submission) => (
                        <Card
                            key={submission.$id}
                            className={submission.isRead ? "" : "border-brand/50 bg-brand/5"}
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            {submission.isRead ? (
                                                <MailOpen className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Mail className="h-4 w-4 text-brand" />
                                            )}
                                            <span className="font-semibold">{submission.name}</span>
                                            {!submission.isRead && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-brand text-brand-foreground">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {submission.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {formatDate(submission.submittedAt)}
                                        </p>

                                        {expandedId === submission.$id ? (
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {submission.message}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {submission.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                setExpandedId(
                                                    expandedId === submission.$id ? null : submission.$id
                                                )
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {!submission.isRead && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleMarkAsRead(submission.$id)}
                                                title="Mark as read"
                                            >
                                                <MailOpen className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(submission.$id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

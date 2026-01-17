"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Save, X, ChevronDown, ChevronUp, Users } from "lucide-react";
import {
    getUpcomingEvents,
    createUpcomingEvent,
    updateUpcomingEvent,
    deleteUpcomingEvent,
    getRegistrationsByEvent,
    getSectionsByEvent,
    type UpcomingEvent,
    type TournamentRegistration,
    type TournamentSection,
} from "@/lib/database";


export function EventsManager() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    // State for registrations view
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
    const [sections, setSections] = useState<TournamentSection[]>([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        entryFee: "",
        timeControl: "",
        isActive: true,
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await getUpcomingEvents(false, false); // Show all events (including inactive and past) for admin
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadRegistrations = async (eventId: string) => {
        setLoadingRegistrations(true);
        try {
            const [regs, sects] = await Promise.all([
                getRegistrationsByEvent(eventId),
                getSectionsByEvent(eventId),
            ]);
            setRegistrations(regs);
            setSections(sects);
        } catch (error) {
            console.error("Failed to load registrations:", error);
        } finally {
            setLoadingRegistrations(false);
        }
    };

    const toggleExpand = async (eventId: string) => {
        if (expandedEventId === eventId) {
            setExpandedEventId(null);
            setRegistrations([]);
            setSections([]);
        } else {
            setExpandedEventId(eventId);
            await loadRegistrations(eventId);
        }
    };


    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            eventDate: "",
            location: "",
            entryFee: "",
            timeControl: "",
            isActive: true,
        });
        setEditing(null);
        setCreating(false);
    };

    const handleEdit = (event: UpcomingEvent) => {
        const date = new Date(event.eventDate);
        const localDateTime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);

        setFormData({
            title: event.title,
            description: event.description || "",
            eventDate: localDateTime,
            location: event.location || "",
            entryFee: event.entryFee || "",
            timeControl: event.timeControl || "",
            isActive: event.isActive,
        });
        setEditing(event.$id);
        setCreating(false);
    };

    const handleCreate = () => {
        resetForm();
        setCreating(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.eventDate) return;

        setSaving(true);
        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                eventDate: new Date(formData.eventDate).toISOString(),
                location: formData.location,
                entryFee: formData.entryFee,
                timeControl: formData.timeControl,
                isActive: formData.isActive,
            };

            if (creating) {
                await createUpcomingEvent(eventData);
            } else if (editing) {
                await updateUpcomingEvent(editing, eventData);
            }
            await loadEvents();
            resetForm();
        } catch (error) {
            console.error("Failed to save event:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await deleteUpcomingEvent(id);
            await loadEvents();
        } catch (error) {
            console.error("Failed to delete event:", error);
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
                    <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage tournament events and competitions
                    </p>
                </div>
                {!creating && !editing && (
                    <Button onClick={handleCreate} className="bg-brand hover:bg-brand/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Event
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {(creating || editing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{creating ? "New Event" : "Edit Event"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Event title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="eventDate">Date & Time *</Label>
                                <Input
                                    id="eventDate"
                                    type="datetime-local"
                                    value={formData.eventDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, eventDate: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Event description..."
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({ ...formData, location: e.target.value })
                                    }
                                    placeholder="Event venue"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="entryFee">Entry Fee</Label>
                                <Input
                                    id="entryFee"
                                    value={formData.entryFee}
                                    onChange={(e) =>
                                        setFormData({ ...formData, entryFee: e.target.value })
                                    }
                                    placeholder="$20 / Free"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeControl">Time Control</Label>
                                <Input
                                    id="timeControl"
                                    value={formData.timeControl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, timeControl: e.target.value })
                                    }
                                    placeholder="G/60+10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isActive: checked })
                                }
                            />
                            <Label htmlFor="isActive">Active (visible to public)</Label>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Save
                            </Button>
                            <Button variant="outline" onClick={resetForm}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Events List */}
            <div className="space-y-4">
                {events.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No events yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => {
                        const isExpanded = expandedEventId === event.$id;
                        const getSectionName = (sectionId?: string) => {
                            if (!sectionId) return "—";
                            const section = sections.find(s => s.$id === sectionId);
                            return section?.name || "Unknown";
                        };

                        return (
                            <Card key={event.$id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">{event.title}</h3>
                                                {event.timeControl && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-brand/10 text-brand">
                                                        {event.timeControl}
                                                    </span>
                                                )}
                                                {!event.isActive && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {formatDate(event.eventDate)}
                                            </p>
                                            {event.location && (
                                                <p className="text-sm text-muted-foreground">
                                                    📍 {event.location}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleExpand(event.$id)}
                                                className="gap-1"
                                            >
                                                <Users className="h-4 w-4" />
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(event)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(event.$id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expandable Registrations Section */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t">
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <Users className="h-4 w-4 text-brand" />
                                                Registrations ({registrations.length})
                                            </h4>

                                            {loadingRegistrations ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="h-6 w-6 animate-spin text-brand" />
                                                </div>
                                            ) : registrations.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-8">
                                                    No registrations yet.
                                                </p>
                                            ) : (
                                                <div className="rounded-md border overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Player</TableHead>
                                                                <TableHead>USCF ID</TableHead>
                                                                <TableHead>Rating</TableHead>
                                                                <TableHead>Section</TableHead>
                                                                <TableHead>Email</TableHead>
                                                                <TableHead>Phone</TableHead>
                                                                <TableHead>Byes</TableHead>
                                                                <TableHead>Registered</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {registrations.map((reg) => (
                                                                <TableRow key={reg.$id}>
                                                                    <TableCell className="font-medium">
                                                                        {reg.playerName}
                                                                    </TableCell>
                                                                    <TableCell>{reg.uscfId}</TableCell>
                                                                    <TableCell>{reg.rating || "Unr"}</TableCell>
                                                                    <TableCell>{getSectionName(reg.sectionId)}</TableCell>
                                                                    <TableCell className="text-sm">
                                                                        {reg.email}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm">
                                                                        {reg.phone || "—"}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm">
                                                                        {reg.byeRounds || "—"}
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-muted-foreground">
                                                                        {new Date(reg.registeredAt).toLocaleDateString()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

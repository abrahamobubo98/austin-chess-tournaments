"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import {
    getWeeklyEvents,
    createWeeklyEvent,
    updateWeeklyEvent,
    deleteWeeklyEvent,
    type WeeklyEvent,
} from "@/lib/database";

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export function WeeklyEventsManager() {
    const [events, setEvents] = useState<WeeklyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dayOfWeek: "Monday",
        time: "",
        location: "",
        isActive: true,
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const data = await getWeeklyEvents(false);
            // Sort by day of week
            const sorted = [...data].sort((a, b) => {
                return DAYS_OF_WEEK.indexOf(a.dayOfWeek) - DAYS_OF_WEEK.indexOf(b.dayOfWeek);
            });
            setEvents(sorted);
        } catch (error) {
            console.error("Failed to load weekly events:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            dayOfWeek: "Monday",
            time: "",
            location: "",
            isActive: true,
        });
        setEditing(null);
        setCreating(false);
    };

    const handleEdit = (event: WeeklyEvent) => {
        setFormData({
            title: event.title,
            description: event.description || "",
            dayOfWeek: event.dayOfWeek,
            time: event.time,
            location: event.location || "",
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
        if (!formData.title.trim() || !formData.time.trim()) return;

        setSaving(true);
        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                dayOfWeek: formData.dayOfWeek,
                time: formData.time,
                location: formData.location,
                isActive: formData.isActive,
            };

            if (creating) {
                await createWeeklyEvent(eventData);
            } else if (editing) {
                await updateWeeklyEvent(editing, eventData);
            }
            await loadEvents();
            resetForm();
        } catch (error) {
            console.error("Failed to save weekly event:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this weekly event?")) return;

        try {
            await deleteWeeklyEvent(id);
            await loadEvents();
        } catch (error) {
            console.error("Failed to delete weekly event:", error);
        }
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
                    <h2 className="text-xl font-semibold">Weekly Events</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage recurring weekly activities
                    </p>
                </div>
                {!creating && !editing && (
                    <Button onClick={handleCreate} className="bg-brand hover:bg-brand/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Weekly Event
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {(creating || editing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {creating ? "New Weekly Event" : "Edit Weekly Event"}
                        </CardTitle>
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
                                <Label htmlFor="dayOfWeek">Day of Week *</Label>
                                <select
                                    id="dayOfWeek"
                                    value={formData.dayOfWeek}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dayOfWeek: e.target.value })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {DAYS_OF_WEEK.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
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

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="time">Time *</Label>
                                <Input
                                    id="time"
                                    value={formData.time}
                                    onChange={(e) =>
                                        setFormData({ ...formData, time: e.target.value })
                                    }
                                    placeholder="7:00 PM - 10:00 PM"
                                />
                            </div>

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
                            <p className="text-muted-foreground">No weekly events yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => (
                        <Card key={event.$id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow flex items-center gap-4">
                                        <div className="flex-shrink-0 w-24">
                                            <div className="bg-brand/10 text-brand font-semibold text-sm px-3 py-1.5 rounded-md text-center">
                                                {event.dayOfWeek}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">{event.title}</h3>
                                                {!event.isActive && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {event.time}
                                                {event.location && ` • ${event.location}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
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
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

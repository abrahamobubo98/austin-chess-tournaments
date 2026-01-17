"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Save,
    X,
} from "lucide-react";
import {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    type Announcement,
} from "@/lib/database";

export function AnnouncementsManager() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        isActive: true,
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await getAnnouncements(false);
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to load announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", content: "", isActive: true });
        setEditing(null);
        setCreating(false);
    };

    const handleEdit = (announcement: Announcement) => {
        setFormData({
            title: announcement.title,
            content: announcement.content,
            isActive: announcement.isActive,
        });
        setEditing(announcement.$id);
        setCreating(false);
    };

    const handleCreate = () => {
        resetForm();
        setCreating(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) return;

        setSaving(true);
        try {
            if (creating) {
                await createAnnouncement({
                    title: formData.title,
                    content: formData.content,
                    publishedAt: new Date().toISOString(),
                    isActive: formData.isActive,
                    authorId: user?.$id || "",
                });
            } else if (editing) {
                await updateAnnouncement(editing, {
                    title: formData.title,
                    content: formData.content,
                    isActive: formData.isActive,
                });
            }
            await loadAnnouncements();
            resetForm();
        } catch (error) {
            console.error("Failed to save announcement:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            await deleteAnnouncement(id);
            await loadAnnouncements();
        } catch (error) {
            console.error("Failed to delete announcement:", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
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
                    <h2 className="text-xl font-semibold">Announcements</h2>
                    <p className="text-sm text-muted-foreground">
                        Post updates and news for club members
                    </p>
                </div>
                {!creating && !editing && (
                    <Button onClick={handleCreate} className="bg-brand hover:bg-brand/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Announcement
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {(creating || editing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {creating ? "New Announcement" : "Edit Announcement"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Announcement title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                placeholder="Announcement content..."
                                rows={5}
                            />
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

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No announcements yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card key={announcement.$id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{announcement.title}</h3>
                                            {!announcement.isActive && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {formatDate(announcement.publishedAt)}
                                        </p>
                                        <p className="text-sm line-clamp-2">{announcement.content}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEdit(announcement)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(announcement.$id)}
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

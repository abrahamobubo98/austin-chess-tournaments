"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, Save, X, ExternalLink } from "lucide-react";
import {
    getResources,
    createResource,
    updateResource,
    deleteResource,
    type Resource,
} from "@/lib/database";

const CATEGORIES = [
    "Rules",
    "Tutorials",
    "Books",
    "Organizations",
    "Online Play",
    "General",
];

export function ResourcesManager() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        category: "General",
        sortOrder: 0,
    });

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        setLoading(true);
        try {
            const data = await getResources();
            setResources(data);
        } catch (error) {
            console.error("Failed to load resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            url: "",
            category: "General",
            sortOrder: 0,
        });
        setEditing(null);
        setCreating(false);
    };

    const handleEdit = (resource: Resource) => {
        setFormData({
            title: resource.title,
            description: resource.description || "",
            url: resource.url,
            category: resource.category || "General",
            sortOrder: resource.sortOrder || 0,
        });
        setEditing(resource.$id);
        setCreating(false);
    };

    const handleCreate = () => {
        resetForm();
        setCreating(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.url.trim()) return;

        setSaving(true);
        try {
            const resourceData = {
                title: formData.title,
                description: formData.description,
                url: formData.url,
                category: formData.category,
                sortOrder: formData.sortOrder,
            };

            if (creating) {
                await createResource(resourceData);
            } else if (editing) {
                await updateResource(editing, resourceData);
            }
            await loadResources();
            resetForm();
        } catch (error) {
            console.error("Failed to save resource:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        try {
            await deleteResource(id);
            await loadResources();
        } catch (error) {
            console.error("Failed to delete resource:", error);
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
                    <h2 className="text-xl font-semibold">Resources</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage helpful links and learning materials
                    </p>
                </div>
                {!creating && !editing && (
                    <Button onClick={handleCreate} className="bg-brand hover:bg-brand/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Resource
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {(creating || editing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{creating ? "New Resource" : "Edit Resource"}</CardTitle>
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
                                    placeholder="Resource title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL *</Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData({ ...formData, url: e.target.value })
                                }
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Brief description..."
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) =>
                                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                                }
                                placeholder="0"
                                className="w-24"
                            />
                            <p className="text-xs text-muted-foreground">
                                Lower numbers appear first
                            </p>
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

            {/* Resources List */}
            <div className="space-y-4">
                {resources.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No resources yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    resources.map((resource) => (
                        <Card key={resource.$id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{resource.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded bg-brand/10 text-brand">
                                                {resource.category}
                                            </span>
                                        </div>
                                        {resource.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {resource.description}
                                            </p>
                                        )}
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-brand hover:underline inline-flex items-center gap-1"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {resource.url}
                                        </a>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEdit(resource)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(resource.$id)}
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

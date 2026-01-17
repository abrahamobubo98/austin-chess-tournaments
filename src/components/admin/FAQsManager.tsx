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
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    type FAQ,
} from "@/lib/database";

export function FAQsManager() {
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        sortOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setLoading(true);
        try {
            const data = await getFAQs(false);
            setFAQs(data);
        } catch (error) {
            console.error("Failed to load FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            question: "",
            answer: "",
            sortOrder: 0,
            isActive: true,
        });
        setEditing(null);
        setCreating(false);
    };

    const handleEdit = (faq: FAQ) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
            sortOrder: faq.sortOrder || 0,
            isActive: faq.isActive,
        });
        setEditing(faq.$id);
        setCreating(false);
    };

    const handleCreate = () => {
        resetForm();
        setCreating(true);
    };

    const handleSave = async () => {
        if (!formData.question.trim() || !formData.answer.trim()) return;

        setSaving(true);
        try {
            const faqData = {
                question: formData.question,
                answer: formData.answer,
                sortOrder: formData.sortOrder,
                isActive: formData.isActive,
            };

            if (creating) {
                await createFAQ(faqData);
            } else if (editing) {
                await updateFAQ(editing, faqData);
            }
            await loadFAQs();
            resetForm();
        } catch (error) {
            console.error("Failed to save FAQ:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        try {
            await deleteFAQ(id);
            await loadFAQs();
        } catch (error) {
            console.error("Failed to delete FAQ:", error);
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
                    <h2 className="text-xl font-semibold">FAQs</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage frequently asked questions
                    </p>
                </div>
                {!creating && !editing && (
                    <Button onClick={handleCreate} className="bg-brand hover:bg-brand/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New FAQ
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {(creating || editing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{creating ? "New FAQ" : "Edit FAQ"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question *</Label>
                            <Input
                                id="question"
                                value={formData.question}
                                onChange={(e) =>
                                    setFormData({ ...formData, question: e.target.value })
                                }
                                placeholder="What is the question?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer *</Label>
                            <Textarea
                                id="answer"
                                value={formData.answer}
                                onChange={(e) =>
                                    setFormData({ ...formData, answer: e.target.value })
                                }
                                placeholder="Provide a detailed answer..."
                                rows={4}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Input
                                    id="sortOrder"
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            sortOrder: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                    className="w-24"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isActive: checked })
                                    }
                                />
                                <Label htmlFor="isActive">Active (visible to public)</Label>
                            </div>
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

            {/* FAQs List */}
            <div className="space-y-4">
                {faqs.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No FAQs yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    faqs.map((faq, index) => (
                        <Card key={faq.$id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                #{index + 1}
                                            </span>
                                            {!faq.isActive && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {faq.answer}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEdit(faq)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(faq.$id)}
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

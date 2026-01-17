"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    Crown,
    LogOut,
    Megaphone,
    Calendar,
    CalendarDays,
    BookOpen,
    HelpCircle,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { WeeklyEventsManager } from "@/components/admin/WeeklyEventsManager";
import { ResourcesManager } from "@/components/admin/ResourcesManager";
import { FAQsManager } from "@/components/admin/FAQsManager";
import { ContactSubmissionsManager } from "@/components/admin/ContactSubmissionsManager";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("announcements");

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-brand" />
                        <span className="font-bold">Admin Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            {user?.email}
                        </span>
                        <ThemeToggle />
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your chess club content and events
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
                        <TabsTrigger
                            value="announcements"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <Megaphone className="h-4 w-4 mr-2" />
                            Announcements
                        </TabsTrigger>
                        <TabsTrigger
                            value="events"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Events
                        </TabsTrigger>
                        <TabsTrigger
                            value="weekly"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Weekly
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Resources
                        </TabsTrigger>
                        <TabsTrigger
                            value="faqs"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <HelpCircle className="h-4 w-4 mr-2" />
                            FAQs
                        </TabsTrigger>
                        <TabsTrigger
                            value="contacts"
                            className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Contacts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="announcements" className="mt-6">
                        <AnnouncementsManager />
                    </TabsContent>

                    <TabsContent value="events" className="mt-6">
                        <EventsManager />
                    </TabsContent>

                    <TabsContent value="weekly" className="mt-6">
                        <WeeklyEventsManager />
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6">
                        <ResourcesManager />
                    </TabsContent>

                    <TabsContent value="faqs" className="mt-6">
                        <FAQsManager />
                    </TabsContent>

                    <TabsContent value="contacts" className="mt-6">
                        <ContactSubmissionsManager />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
